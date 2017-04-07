# DashVid.io

# Concourse

To load the build into Concourse run the following commands

`fly -t jassoft login -n JassoftLtd -c http://concourse.jassoft.co.uk:8080`

`fly -t jassoft set-pipeline -p DashVid.io -c DashVid.yml --load-vars-from secrets.yml`

`fly -t jassoft unpause-pipeline --pipeline DashVid.io`

# Setup GitHub OAuth 
```
fly -t jassoft set-team -n JassoftLtd \
    --github-auth-client-id CLIENT_ID \
    --github-auth-client-secret CLIENT_SECRET \
    --github-auth-organization=JassoftLtd
```