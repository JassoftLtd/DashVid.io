# DashVid.io

## Developing the UI
Build the UI
```
npm install
```

Run Storybook the UI 
```
npm run storybook
```

Run the UI
```
npm start
```

# Concourse

To load the build into Concourse run the following commands

`fly -t jassoft login -n main -c CONCOURSE_URL`

`fly -t jassoft set-pipeline -p DashVid.io -c DashVid.yml --load-vars-from secrets.yml`

`fly -t jassoft unpause-pipeline --pipeline DashVid.io`


To deploy Developer pipeline

`fly -t jassoft set-pipeline -p DashVid.io-Jon -c DashVid-Developer.yml --load-vars-from developer-secrets.yml`