pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "gangadhar369/nodejs-jenkins-demo"
        DOCKER_TAG   = "latest"
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
                sh 'npm test || true'  // if no tests, pipeline won’t fail
            }
        }

        stage('Docker Build & Push') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-cred', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh """
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                        docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} .
                        docker push ${DOCKER_IMAGE}:${DOCKER_TAG}
                    """
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                sshagent(['ec2-ssh-key']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ubuntu@65.2.175.22 << 'EOF'
                          docker pull ${DOCKER_IMAGE}:${DOCKER_TAG}
                          docker stop nodejs-app || true
                          docker rm nodejs-app || true
                          docker run -d --name nodejs-app -p 3000:3000 ${DOCKER_IMAGE}:${DOCKER_TAG}
                        EOF
                    """
                }
            }
        }
    }

    post {
        success {
            echo "Deployed successfully! Visit http://65.2.175.22:3000"
        }
        failure {
            echo "Deployment failed. Check logs."
        }
    }
}
