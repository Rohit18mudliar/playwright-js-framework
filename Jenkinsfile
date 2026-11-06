pipeline {
    agent any

    environment {
        CI = 'true'       
    }

    options {
        timeout(time: 30, unit: 'MINUTES')       // prevent hung builds
        disableConcurrentBuilds()                 // avoid parallel runs clashing on shared resources
        buildDiscarder(logRotator(numToKeepStr: '20')) // don't let old builds pile up     
    }
 
    stages {
        stage('Checkout') {
            steps {
                checkout scm  // pulls the SAME repo Jenkins is configured to watch
            }
        }
        stage('Install') {
            steps {
                bat 'call npm ci'
                bat 'call npx playwright install --with-deps'
            }
        }
        stage('Run Tests') {
            steps {
                bat 'call npm run regression'
            }
        }
    }
	
	  post {
        always {
            // Publish HTML report
            publishHTML(target: [
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright HTML Report',
                keepAll: true,
                alwaysLinkToLastBuild: true
            ])

            // Archive raw artifacts (screenshots, videos, traces on failure)
            archiveArtifacts artifacts: 'test-results/**', allowEmptyArchive: true

            // Generate Allure report
            allure includeProperties: false, results: [[path: 'allure-results']]
        }

        failure {
            echo 'Failure....'        
            
            // 3. Dispatch the failure email with the report attached
            emailext (

						to: 'rohit18mudliar@gmail.com',								
          		     	  subject: " [FAILED] ALERT: Playwright Test Failure - Build #${env.BUILD_NUMBER}",
							body: """<h3>Playwright Test Suite Failed!</h3>
									 <p>The automated test pipeline encountered a failure during execution.</p>
									 <p><b>Job:</b> ${env.JOB_NAME}<br>
									 <b>Build Number:</b> ${env.BUILD_NUMBER}<br>								
									  <p>Playwright test build failed.</p>
					                    <p><a href="${env.BUILD_URL}console">View Console Output</a></p>
										<p><a href="${env.BUILD_URL}allure/">View Allure Report</a></p>	
					                    <p><a href="${env.BUILD_URL}Playwright_20HTML_20Report/">View HTML Report</a></p>										
									""",
							mimeType: 'text/html',
							attachLog: true,
							attachmentsPattern: 'test-results/**/test-failed*.png'          
            )   	
        }

        success {
            echo 'All tests passed ✅'
        }

        cleanup {
            cleanWs()  // clean workspace after every run, pass or fail
        }
    }
}
