FROM ubuntu:latest

ENV TERRAFORM_VERSION=0.8.2
ENV TERRAFORM_SHA256SUM=a366fd2d7d8908d23acc23ab151fc692615a147f8832971bb43e42995554c652

RUN apt-get update -y && \
    apt-get install -y curl && \
    curl -sL https://deb.nodesource.com/setup_6.x | bash - && \
    apt-get update -y && \
    apt-get install -y git zip unzip npm nodejs && \
    curl https://releases.hashicorp.com/terraform/${TERRAFORM_VERSION}/terraform_${TERRAFORM_VERSION}_linux_amd64.zip > terraform_${TERRAFORM_VERSION}_linux_amd64.zip && \
    echo "${TERRAFORM_SHA256SUM}  terraform_${TERRAFORM_VERSION}_linux_amd64.zip" > terraform_${TERRAFORM_VERSION}_SHA256SUMS && \
    sha256sum -c terraform_${TERRAFORM_VERSION}_SHA256SUMS && \
    unzip terraform_${TERRAFORM_VERSION}_linux_amd64.zip -d /bin && \
    rm -f terraform_${TERRAFORM_VERSION}_linux_amd64.zip

RUN \
  mkdir -p /goroot && \
  curl https://storage.googleapis.com/golang/go1.4.2.linux-amd64.tar.gz | tar xvzf - -C /goroot --strip-components=1

# Set environment variables.
ENV GOROOT /goroot
ENV GOPATH /gopath
ENV PATH $GOROOT/bin:$GOPATH/bin:$PATH

RUN chown -R root:root $GOROOT/bin/go

WORKDIR /code

#CMD ./build.sh