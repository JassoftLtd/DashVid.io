node {

   stage 'Checkout'
   checkout([$class: 'GitSCM', branches: [[name: '*/master']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[url: 'https://github.com/jonnyshaw89/VideoServerless.git']]])

   stage 'Build'
   sh 'build.sh'

   stage 'Plan'
   sh 'terraform plan'

//   stage 'Apply'
//   sh 'terraform apply'

}