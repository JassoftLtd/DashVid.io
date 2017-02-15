# DashCam Video Processor - Serverless Design

Setup S3 state

```
terraform remote config \
    -backend=s3 \
    -backend-config="bucket=dashvid-terraform-state-tests" \
    -backend-config="key=terraform.tfstate" \
    -backend-config="region=eu-west-1"
```

Running

run `terraform apply -parallelism=1` to see it work.



`fly -t dashvid login -c http://concourse.jassoft.co.uk`
`fly -t dashvid set-pipeline -p DashVid.io -c DashVid.yml --load-vars-from secrets.yml`
`fly -t dashvid unpause-pipeline --pipeline DashVid.io`