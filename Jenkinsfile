#!groovy
pipeline {
    agent any
    tools{
        nodejs 'nodejs'
    }
    triggers {
//        每五分钟去检查一下远程仓库，看代码是否发生变化
        pollSCM('H/5 * * * *')
    }
    //根据项目和自己的邮箱修改以下参数
    environment {
        projectName = "health-emr-web"
        emailAddress = "782813985@qq.com"
        projectDirName= "/mnt/data/app/health_emr_web/"
        hostName= "gpstandby"
    }
    stages {

        stage('Build') {
            steps {
                echo 'Building...'
                sh   'su -'
                sh   'sudo yarn install'
                sh   'sudo npm run build'
                sh   'rm -rf '+ projectDirName + 'dist/*'
                sh   'mv dist '+ projectDirName
            }
        }
        stage('Deploy'){
            steps{
                sh   projectDirName + 'web.sh'
            }
        }
    }
    post {
        //构建失败发送邮件
        failure {
            mail to: emailAddress, subject: projectName+' build failed', body: projectName+' build failed,please fix!'
        }
        //构建成功发送邮件
        success{
            mail to: emailAddress, subject: projectName+' build succeed', body: projectName+' build succeed!!'
        }
    }

}
