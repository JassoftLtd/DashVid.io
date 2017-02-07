'use strict';
console.log('videos uploaded for User');

var AWS = require('aws-sdk');
// Get reference to AWS clients
var dynamodb = new AWS.DynamoDB.DocumentClient();
var sns = new AWS.SNS();

var child_process = require("child_process");
var parseString = require('xml2js').parseString;

exports.handler = function(event, context) {
	var responseCode = 200;
	console.log("request: " + JSON.stringify(event));

    for(var i = 0; i < event.Records.length; i++) {

        var record = event.Records[i];

		var bucket = record.s3.bucket.name;
		var key = record.s3.object.key;

        //Extract the user from the key
        var user = /[^/]*/.exec(key)[0];

		//Extract the videoId from the key
		var videoId = /(.+?)(\.[^.]*$|$)/.exec(/[^/]*$/.exec(key)[0])[1];

        // TODO, validate the uploaded file

        var s3 = new AWS.S3({
            apiVersion: '2006-03-01'
        });

        console.log('Requesting signed URL for bucket [' + bucket + '], Key [' + key + ']')

        const url = s3.getSignedUrl('getObject', {
            Bucket: bucket,
            Key: key,
            Expires: 3600
        });

        child_process.execFile("/var/task/uploadedVideo/mediainfo", ["--full", "--Output=XML"].concat(url), function(err, stdout, stderr) {
            // command output is in stdout
            if(err) {
                console.error(err);
                context.fail();
            }

            parseString(stdout, function (err, result) {
                console.dir(JSON.stringify(result));

                if(!result.Mediainfo.File) {
                    deleteFile(bucket, key)
                }

                var videoRecord;

                for(var f = 0; f < result.Mediainfo.File[0].track.length; f++) {

                    var track = result.Mediainfo.File[0].track[f];

                    if (track.$.type == "Video") {
                        videoRecord = track
                    }
                }

                if(!videoRecord) {
                    deleteFile(bucket, key)
                }
                else {

                    console.log("Video Record: " + JSON.stringify(videoRecord));

                    var encodedDate = (videoRecord.Encoded_date) ? videoRecord.Encoded_date[0] : new Date().getTime().toString()

                    dynamodb.put({
                        TableName: "Videos",
                        Item: {
                            Id: videoId,
                            User: user,
                            Uploaded: new Date().getTime().toString(),
                            VideoStatus: "Uploaded",
                            Bucket: bucket,
                            Key: key,
                            RecordedDate: encodedDate,
                            VideoDuration: videoRecord.Duration[0],
                            MediaInfo: result
                        }
                    }, function (err, data) {
                        if (err) {
                            deleteFile(bucket, key)
                            responseError.body = new Error('Unable to create video record for key [' + key + ']. Error JSON:', JSON.stringify(err, null, 2))
                            context.fail(responseError);
                        } else {
                            console.log("Video create DynammoDb record succeeded");

                            sns.publish({
                                Message: JSON.stringify({
                                    videoId: videoId
                                }),
                                MessageStructure: 'json',
                                TargetArn: process.env.snsNewVideoArn
                            }, function(err, data) {
                                if (err) {
                                    responseError.body = new Error('Error sending SNS message: ' + err)
                                    context.fail(responseError);

                                    return;
                                }

                                console.log('push sent');
                                console.log(data);

                                if (i == event.Records.length - 1) {
                                    context.succeed();
                                }
                            });
                        }
                    });
                }
            });

        });

    }

};

function deleteFile (bucket, key) {

    console.log("Deleting file from bucket with key [" + key + "]")

    var s3 = new AWS.S3({
        apiVersion: '2006-03-01'
    });

    const url = s3.deleteObject({
        Bucket: bucket,
        Key: key,
    }, function(err, data) {
        if(err) {
            responseError.body = new Error('Error deleting file from S3 Buskct [' + bucket + '] Key [' + key + ']')
            context.fail(responseError);
        }
    });

}

//EVENT
// {
//     "Records": [
//     {
//         "eventVersion": "2.0",
//         "eventSource": "aws:s3",
//         "awsRegion": "eu-west-1",
//         "eventTime": "2017-01-04T20:24:21.676Z",
//         "eventName": "ObjectCreated:Put",
//         "userIdentity": {
//             "principalId": "AWS:AROAJD67JECNUTXKY2CHY:CognitoIdentityCredentials"
//         },
//         "requestParameters": {
//             "sourceIPAddress": "82.37.62.130"
//         },
//         "responseElements": {
//             "x-amz-request-id": "542A413054E612B7",
//             "x-amz-id-2": "a5plng54Uonf3C7KRlx1FSZ+xwlMvidRhIOBphW3UcMXrW3ek39OJ+NZ7uT0i9rq8c90Wex7HHE="
//         },
//         "s3": {
//             "s3SchemaVersion": "1.0",
//             "configurationId": "tf-s3-lambda-20170104202259480919742ggp",
//             "bucket": {
//                 "name": "dash-cam-videos",
//                 "ownerIdentity": {
//                     "principalId": "A3PMHVQCLHVUU0"
//                 },
//                 "arn": "arn:aws:s3:::dash-cam-videos"
//             },
//             "object": {
//                 "key": "c0caeae0-d2bb-11e6-a7d8-9d41f43688cd",
//                 "size": 4191180,
//                 "eTag": "b1f507aae053b88257ae4f25e4ea4ebd",
//                 "sequencer": "00586D59F3652EC261"
//             }
//         }
//     }
// ]
// }


// <?xml version="1.0" encoding="UTF-8"?>
// <Mediainfo version="0.1" ref="https://dash-cam-videos.s3-eu-west-1.amazonaws.com/TestUser/fdd19650-d5ef-11e6-beb2-8d4ddaa132ea?AWSAccessKeyId=ASIAIU3F4W2LWTODP42A&amp;Expires=1483917409&amp;Signature=mtsf%2F2WWDd1FRswMcJFoXUTpgQ4%3D&amp;x-amz-security-token=FQoDYXdzEE8aDFo42e%2F%2FJrhVy%2FhWaiLmAVdR%2BCeV%2FLj0%2Brx0M%2FPCnIlQ7OeMzc%2BU2KXLIeDKIm3nCZtQ7irk3x6mvpt7pCmfL2TiLyuH2EeGOVpQFPSOSWnl02ssae7B7fL5vyGL23VVx692EtFmW4xVUbkV1Nvhpfb5NSFfWtHPOk7UGcSl%2B55Tpt%2Bec0LtXLZpk1Dze0WAYJv7sUiHDgccCDLCtAYFaJOaRSR8Q86ID2w1Rk7lBmJept5FrjwfDbKd396F%2BYAKa4VBlP0rI2%2FBzknUc7faiOyxNyu4OsxrvNnPo75jo0BD%2B7g6cwLRnhmGCQ5lwy3626bKV5hvKJHyysMF">
//     <File>
//         <track type="General">
//             <Count>323</Count>
//             <Count_of_stream_of_this_kind>1</Count_of_stream_of_this_kind>
//             <Kind_of_stream>General</Kind_of_stream>
//             <Kind_of_stream>General</Kind_of_stream>
//             <Stream_identifier>0</Stream_identifier>
//             <Count_of_video_streams>1</Count_of_video_streams>
//             <Count_of_audio_streams>1</Count_of_audio_streams>
//             <Count_of_text_streams>1</Count_of_text_streams>
//             <Video_Format_List>AVC</Video_Format_List>
//             <Video_Format_WithHint_List>AVC</Video_Format_WithHint_List>
//             <Codecs_Video>AVC</Codecs_Video>
//             <Video_Language_List>English</Video_Language_List>
//             <Audio_Format_List>AAC</Audio_Format_List>
//             <Audio_Format_WithHint_List>AAC</Audio_Format_WithHint_List>
//             <Audio_codecs>AAC LC</Audio_codecs>
//             <Audio_Language_List>English</Audio_Language_List>
//             <Text_Format_List>Timed Text</Text_Format_List>
//             <Text_Format_WithHint_List>Timed Text</Text_Format_WithHint_List>
//             <Text_codecs>text</Text_codecs>
//             <Text_Language_List>English</Text_Language_List>
//             <Complete_name>https://dash-cam-videos.s3-eu-west-1.amazonaws.com/TestUser/fdd19650-d5ef-11e6-beb2-8d4ddaa132ea?AWSAccessKeyId=ASIAIU3F4W2LWTODP42A&amp;Expires=1483917409&amp;Signature=mtsf%2F2WWDd1FRswMcJFoXUTpgQ4%3D&amp;x-amz-security-token=FQoDYXdzEE8aDFo42e%2F%2FJrhVy%2FhWaiLmAVdR%2BCeV%2FLj0%2Brx0M%2FPCnIlQ7OeMzc%2BU2KXLIeDKIm3nCZtQ7irk3x6mvpt7pCmfL2TiLyuH2EeGOVpQFPSOSWnl02ssae7B7fL5vyGL23VVx692EtFmW4xVUbkV1Nvhpfb5NSFfWtHPOk7UGcSl%2B55Tpt%2Bec0LtXLZpk1Dze0WAYJv7sUiHDgccCDLCtAYFaJOaRSR8Q86ID2w1Rk7lBmJept5FrjwfDbKd396F%2BYAKa4VBlP0rI2%2FBzknUc7faiOyxNyu4OsxrvNnPo75jo0BD%2B7g6cwLRnhmGCQ5lwy3626bKV5hvKJHyysMF</Complete_name>
//             <Folder_name>https://dash-cam-videos.s3-eu-west-1.amazonaws.com/TestUser</Folder_name>
//             <File_name>fdd19650-d5ef-11e6-beb2-8d4ddaa132ea?AWSAccessKeyId=ASIAIU3F4W2LWTODP42A&amp;Expires=1483917409&amp;Signature=mtsf%2F2WWDd1FRswMcJFoXUTpgQ4%3D&amp;x-amz-security-token=FQoDYXdzEE8aDFo42e%2F%2FJrhVy%2FhWaiLmAVdR%2BCeV%2FLj0%2Brx0M%2FPCnIlQ7OeMzc%2BU2KXLIeDKIm3nCZtQ7irk3x6mvpt7pCmfL2TiLyuH2EeGOVpQFPSOSWnl02ssae7B7fL5vyGL23VVx692EtFmW4xVUbkV1Nvhpfb5NSFfWtHPOk7UGcSl%2B55Tpt%2Bec0LtXLZpk1Dze0WAYJv7sUiHDgccCDLCtAYFaJOaRSR8Q86ID2w1Rk7lBmJept5FrjwfDbKd396F%2BYAKa4VBlP0rI2%2FBzknUc7faiOyxNyu4OsxrvNnPo75jo0BD%2B7g6cwLRnhmGCQ5lwy3626bKV5hvKJHyysMF</File_name>
//             <Format>MPEG-4</Format>
//             <Format>MPEG-4</Format>
//             <Format_Extensions_usually_used>mp4 m4v m4a m4b m4p 3gpp 3gp 3gpp2 3g2 k3g jpm jpx mqv ismv isma f4v</Format_Extensions_usually_used>
//             <Commercial_name>MPEG-4</Commercial_name>
//             <Format_profile>JVT</Format_profile>
//             <Internet_media_type>video/mp4</Internet_media_type>
//             <Codec_ID>avc1</Codec_ID>
//             <Codec_ID>avc1 (avc1/isom)</Codec_ID>
//             <Codec_ID_Url>http://www.apple.com/quicktime/download/standalone.html</Codec_ID_Url>
//             <CodecID_Compatible>avc1/isom</CodecID_Compatible>
//             <Codec>MPEG-4</Codec>
//             <Codec>MPEG-4</Codec>
//             <Codec_Extensions_usually_used>mp4 m4v m4a m4b m4p 3gpp 3gp 3gpp2 3g2 k3g jpm jpx mqv ismv isma f4v</Codec_Extensions_usually_used>
//             <File_size>84017152</File_size>
//             <File_size>80.1 MiB</File_size>
//             <File_size>80 MiB</File_size>
//             <File_size>80 MiB</File_size>
//             <File_size>80.1 MiB</File_size>
//             <File_size>80.12 MiB</File_size>
//             <Duration>34952</Duration>
//             <Duration>34s 952ms</Duration>
//             <Duration>34s 952ms</Duration>
//             <Duration>34s 952ms</Duration>
//             <Duration>00:00:34.952</Duration>
//             <Duration>00:00:34;55</Duration>
//             <Duration>00:00:34.952 (00:00:34;55)</Duration>
//             <Overall_bit_rate_mode>VBR</Overall_bit_rate_mode>
//             <Overall_bit_rate_mode>Variable</Overall_bit_rate_mode>
//             <Overall_bit_rate>19230294</Overall_bit_rate>
//             <Overall_bit_rate>19.2 Mbps</Overall_bit_rate>
//             <Frame_rate>59.940</Frame_rate>
//             <Frame_rate>59.940 fps</Frame_rate>
//             <Frame_count>2095</Frame_count>
//             <Stream_size>8767296</Stream_size>
//             <Stream_size>8.36 MiB (10%)</Stream_size>
//             <Stream_size>8 MiB</Stream_size>
//             <Stream_size>8.4 MiB</Stream_size>
//             <Stream_size>8.36 MiB</Stream_size>
//             <Stream_size>8.361 MiB</Stream_size>
//             <Stream_size>8.36 MiB (10%)</Stream_size>
//             <Proportion_of_this_stream>0.10435</Proportion_of_this_stream>
//             <HeaderSize>131064</HeaderSize>
//             <DataSize>75250607</DataSize>
//             <FooterSize>8635481</FooterSize>
//             <IsStreamable>Yes</IsStreamable>
//             <Encoded_date>UTC 2016-11-30 17:50:10</Encoded_date>
//             <Tagged_date>UTC 2016-11-30 17:50:10</Tagged_date>
//             <AMBA dt="binary.base64">AQEI</AMBA>
//         </track>
//         <track type="Video">
//             <Count>334</Count>
//             <Count_of_stream_of_this_kind>1</Count_of_stream_of_this_kind>
//             <Kind_of_stream>Video</Kind_of_stream>
//             <Kind_of_stream>Video</Kind_of_stream>
//             <Stream_identifier>0</Stream_identifier>
//             <StreamOrder>0</StreamOrder>
//             <ID>1</ID>
//             <ID>1</ID>
//             <Format>AVC</Format>
//             <Format_Info>Advanced Video Codec</Format_Info>
//             <Format_Url>http://developers.videolan.org/x264.html</Format_Url>
//             <Commercial_name>AVC</Commercial_name>
//             <Format_profile>Main@L4.2</Format_profile>
//             <Format_settings>CABAC / 1 Ref Frames</Format_settings>
//             <Format_settings__CABAC>Yes</Format_settings__CABAC>
//             <Format_settings__CABAC>Yes</Format_settings__CABAC>
//             <Format_settings__ReFrames>1</Format_settings__ReFrames>
//             <Format_settings__ReFrames>1 frame</Format_settings__ReFrames>
//             <Format_settings__GOP>M=1, N=8</Format_settings__GOP>
//             <Internet_media_type>video/H264</Internet_media_type>
//             <Codec_ID>avc1</Codec_ID>
//             <Codec_ID_Info>Advanced Video Coding</Codec_ID_Info>
//             <Codec_ID_Url>http://www.apple.com/quicktime/download/standalone.html</Codec_ID_Url>
//             <Codec>AVC</Codec>
//             <Codec>AVC</Codec>
//             <Codec_Family>AVC</Codec_Family>
//             <Codec_Info>Advanced Video Codec</Codec_Info>
//             <Codec_Url>http://developers.videolan.org/x264.html</Codec_Url>
//             <Codec_CC>avc1</Codec_CC>
//             <Codec_profile>Main@L4.2</Codec_profile>
//             <Codec_settings>CABAC / 1 Ref Frames</Codec_settings>
//             <Codec_settings__CABAC>Yes</Codec_settings__CABAC>
//             <Codec_Settings_RefFrames>1</Codec_Settings_RefFrames>
//             <Duration>34952</Duration>
//             <Duration>34s 952ms</Duration>
//             <Duration>34s 952ms</Duration>
//             <Duration>34s 952ms</Duration>
//             <Duration>00:00:34.952</Duration>
//             <Duration>00:00:34;55</Duration>
//             <Duration>00:00:34.952 (00:00:34;55)</Duration>
//             <Bit_rate_mode>VBR</Bit_rate_mode>
//             <Bit_rate_mode>Variable</Bit_rate_mode>
//             <Bit_rate>17159615</Bit_rate>
//             <Bit_rate>17.2 Mbps</Bit_rate>
//             <Maximum_bit_rate>18000896</Maximum_bit_rate>
//             <Maximum_bit_rate>18.0 Mbps</Maximum_bit_rate>
//             <Width>1920</Width>
//             <Width>1 920 pixels</Width>
//             <Height>1080</Height>
//             <Height>1 080 pixels</Height>
//             <Stored_Height>1088</Stored_Height>
//             <Sampled_Width>1920</Sampled_Width>
//             <Sampled_Height>1080</Sampled_Height>
//             <Pixel_aspect_ratio>1.000</Pixel_aspect_ratio>
//             <Display_aspect_ratio>1.778</Display_aspect_ratio>
//             <Display_aspect_ratio>16:9</Display_aspect_ratio>
//             <Rotation>0.000</Rotation>
//             <Frame_rate_mode>CFR</Frame_rate_mode>
//             <Frame_rate_mode>Constant</Frame_rate_mode>
//             <Frame_rate>59.940</Frame_rate>
//             <Frame_rate>59.940 (60000/1001) fps</Frame_rate>
//             <FrameRate_Num>60000</FrameRate_Num>
//             <FrameRate_Den>1001</FrameRate_Den>
//             <Frame_count>2095</Frame_count>
//             <Resolution>8</Resolution>
//             <Resolution>8 bits</Resolution>
//             <Colorimetry>4:2:0</Colorimetry>
//             <Color_space>YUV</Color_space>
//             <Chroma_subsampling>4:2:0</Chroma_subsampling>
//             <Chroma_subsampling>4:2:0</Chroma_subsampling>
//             <Bit_depth>8</Bit_depth>
//             <Bit_depth>8 bits</Bit_depth>
//             <Scan_type>Progressive</Scan_type>
//             <Scan_type>Progressive</Scan_type>
//             <Interlacement>PPF</Interlacement>
//             <Interlacement>Progressive</Interlacement>
//             <Bits__Pixel_Frame_>0.138</Bits__Pixel_Frame_>
//             <Stream_size>74969540</Stream_size>
//             <Stream_size>71.5 MiB (89%)</Stream_size>
//             <Stream_size>71 MiB</Stream_size>
//             <Stream_size>71 MiB</Stream_size>
//             <Stream_size>71.5 MiB</Stream_size>
//             <Stream_size>71.50 MiB</Stream_size>
//             <Stream_size>71.5 MiB (89%)</Stream_size>
//             <Proportion_of_this_stream>0.89231</Proportion_of_this_stream>
//             <Title>Ambarella AVC</Title>
//             <Language>en</Language>
//             <Language>English</Language>
//             <Language>English</Language>
//             <Language>en</Language>
//             <Language>eng</Language>
//             <Language>en</Language>
//             <Encoded_date>UTC 2016-11-30 17:50:10</Encoded_date>
//             <Tagged_date>UTC 2016-11-30 17:50:10</Tagged_date>
//             <Buffer_size>18000000 / 18000000</Buffer_size>
//             <Color_range>Full</Color_range>
//         </track>
//         <track type="Audio">
//             <Count>272</Count>
//             <Count_of_stream_of_this_kind>1</Count_of_stream_of_this_kind>
//             <Kind_of_stream>Audio</Kind_of_stream>
//             <Kind_of_stream>Audio</Kind_of_stream>
//             <Stream_identifier>0</Stream_identifier>
//             <StreamOrder>1</StreamOrder>
//             <ID>2</ID>
//             <ID>2</ID>
//             <Format>AAC</Format>
//             <Format_Info>Advanced Audio Codec</Format_Info>
//             <Commercial_name>AAC</Commercial_name>
//             <Format_profile>LC</Format_profile>
//             <Codec_ID>40</Codec_ID>
//             <Codec>AAC LC</Codec>
//             <Codec>AAC LC</Codec>
//             <Codec_Family>AAC</Codec_Family>
//             <Codec_CC>40</Codec_CC>
//             <Duration>34944</Duration>
//             <Duration>34s 944ms</Duration>
//             <Duration>34s 944ms</Duration>
//             <Duration>34s 944ms</Duration>
//             <Duration>00:00:34.944</Duration>
//             <Duration>00:00:34:40</Duration>
//             <Duration>00:00:34.944 (00:00:34:40)</Duration>
//             <Bit_rate_mode>CBR</Bit_rate_mode>
//             <Bit_rate_mode>Constant</Bit_rate_mode>
//             <Bit_rate>64001</Bit_rate>
//             <Bit_rate>64.0 Kbps</Bit_rate>
//             <Nominal_bit_rate>128000</Nominal_bit_rate>
//             <Nominal_bit_rate>128 Kbps</Nominal_bit_rate>
//             <Channel_s_>1</Channel_s_>
//             <Channel_s_>1 channel</Channel_s_>
//             <Channel_positions>Front: C</Channel_positions>
//             <Channel_positions>1/0/0</Channel_positions>
//             <ChannelLayout>C</ChannelLayout>
//             <Samples_per_frame>1024</Samples_per_frame>
//             <Sampling_rate>48000</Sampling_rate>
//             <Sampling_rate>48.0 KHz</Sampling_rate>
//             <Samples_count>1677312</Samples_count>
//             <Frame_rate>46.875</Frame_rate>
//             <Frame_rate>46.875 fps (1024 spf)</Frame_rate>
//             <Frame_count>1638</Frame_count>
//             <Compression_mode>Lossy</Compression_mode>
//             <Compression_mode>Lossy</Compression_mode>
//             <Stream_size>279555</Stream_size>
//             <Stream_size>273 KiB (0%)</Stream_size>
//             <Stream_size>273 KiB</Stream_size>
//             <Stream_size>273 KiB</Stream_size>
//             <Stream_size>273 KiB</Stream_size>
//             <Stream_size>273.0 KiB</Stream_size>
//             <Stream_size>273 KiB (0%)</Stream_size>
//             <Proportion_of_this_stream>0.00333</Proportion_of_this_stream>
//             <Title>Ambarella AAC</Title>
//             <Language>en</Language>
//             <Language>English</Language>
//             <Language>English</Language>
//             <Language>en</Language>
//             <Language>eng</Language>
//             <Language>en</Language>
//             <Encoded_date>UTC 2016-11-30 17:50:10</Encoded_date>
//             <Tagged_date>UTC 2016-11-30 17:50:10</Tagged_date>
//         </track>
//         <track type="Text">
//             <Count>234</Count>
//             <Count_of_stream_of_this_kind>1</Count_of_stream_of_this_kind>
//             <Kind_of_stream>Text</Kind_of_stream>
//             <Kind_of_stream>Text</Kind_of_stream>
//             <Stream_identifier>0</Stream_identifier>
//             <StreamOrder>2</StreamOrder>
//             <ID>3</ID>
//             <ID>3</ID>
//             <Format>Timed Text</Format>
//             <Commercial_name>Timed Text</Commercial_name>
//             <Codec_ID>text</Codec_ID>
//             <Codec_ID_Url>http://www.apple.com/quicktime/download/standalone.html</Codec_ID_Url>
//             <Codec>text</Codec>
//             <Codec>text</Codec>
//             <Duration>34000</Duration>
//             <Duration>34s 0ms</Duration>
//             <Duration>34s 0ms</Duration>
//             <Duration>34s 0ms</Duration>
//             <Duration>00:00:34.000</Duration>
//             <Duration>00:00:34:00</Duration>
//             <Duration>00:00:34.000 (00:00:34:00)</Duration>
//             <Bit_rate_mode>VBR</Bit_rate_mode>
//             <Bit_rate_mode>Variable</Bit_rate_mode>
//             <Bit_rate>179</Bit_rate>
//             <Bit_rate>179 bps</Bit_rate>
//             <Frame_rate>1.000</Frame_rate>
//             <Frame_rate>1.000 fps</Frame_rate>
//             <Frame_count>34</Frame_count>
//             <Stream_size>761</Stream_size>
//             <Stream_size>761 Bytes (0%)</Stream_size>
//             <Stream_size>761 Bytes</Stream_size>
//             <Stream_size>761 Bytes</Stream_size>
//             <Stream_size>761 Bytes</Stream_size>
//             <Stream_size>761.0 Bytes</Stream_size>
//             <Stream_size>761 Bytes (0%)</Stream_size>
//             <Proportion_of_this_stream>0.00001</Proportion_of_this_stream>
//             <Title>Ambarella EXT</Title>
//             <Language>en</Language>
//             <Language>English</Language>
//             <Language>English</Language>
//             <Language>en</Language>
//             <Language>eng</Language>
//             <Language>en</Language>
//             <Forced>No</Forced>
//             <Forced>No</Forced>
//             <Encoded_date>UTC 2016-11-30 17:50:10</Encoded_date>
//             <Tagged_date>UTC 2016-11-30 17:50:10</Tagged_date>
//         </track>
//     </File>
// </Mediainfo>