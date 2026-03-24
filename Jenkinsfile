pipeline{
    agent any
    
    stages{

        stage('build'){
            steps{
                echo "Ashish Building the Application docker end to end "
                script{
                    checkout scmGit(branches: [[name: '/dev']], extensions: [], userRemoteConfigs: [[credentialsId: 'demo-app-git-creds', url: 'https://github.com/ash24ish/docker-compose-demo.git']])
                }
            }
        }

        stage('test'){
            steps{
                echo "Ashish TESTING the Application docker end to end "

                script{

                }
            }
        }
        
        stage('deploy'){
            steps{
                echo "Ashish Deploying the Application docker end to end "
            }
        }

    }

}