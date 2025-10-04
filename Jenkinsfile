pipeline {
    agent any

    environment {
        DOCKER_HUB_USER = 'gangadhar369'
        DOCKER_IMAGE = 'nodejs-jenkins-demo'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                sh 'npm install'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test'
            }
        }

        stage('Docker Build & Push') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-hub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                        docker build -t $DOCKER_HUB_USER/$DOCKER_IMAGE:latest .
                        docker push $DOCKER_HUB_USER/$DOCKER_IMAGE:latest
                    '''
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                sshagent (credentials: ['ec2-ssh-key']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no ec2-user@65.2.175.22 "
                            docker pull $DOCKER_HUB_USER/$DOCKER_IMAGE:latest &&
                            docker stop nodeapp || true &&
                            docker rm nodeapp || true &&
                            docker run -d --name nodeapp -p 3000:3000 $DOCKER_HUB_USER/$DOCKER_IMAGE:latest
                        "
                    '''
                }
            }
        }
    }

    post {
        failure {
            echo '❌ Deployment failed. Please check logs.'
        }
        success {
            echo '✅ Application deployed successfully to EC2 at http://65.2.175.22:3000'
        }
    }
}
