@Library("jenkins-library") _
podTemplate(label: 'orca-db-services-dind-pod', containers: getTemplates(),
volumes: [emptyDirVolume(memory: false, mountPath: '/var/lib/docker')]) {
    node('orca-db-services-dind-pod') {
        properties([disableConcurrentBuilds()])

        // *****************************************************************
        // chiron-dev means deploy in eks chiron, namespace dev
        def (k8s_id, deploy_env) = branch_name.tokenize( '-' )

        def repo_name = 'warriortrading.orca.db.services'
        def image_name = "orca-db-services"

        ///////////////////////////////////////////////////////////////////////////////
        def eks_config = eksHelper.getEksConfig(k8s_id)
        def build_config = repoHelper.getBuildImageConfig(repo_name, image_name)

        stage('1. checkout code, build & push image and tag repo') {
            container('docker') {
                echo "start ===> 1. checkout code, build image, push image and tag repo"

                withCredentials([
                    string(credentialsId: build_config.github_read_packages_credentialsId, variable: 'GITHUB_TOKEN_READ_WT_PACKAGES')
                    ]) {
                    build_args="GITHUB_TOKEN_READ_WT_PACKAGES=${GITHUB_TOKEN_READ_WT_PACKAGES}"
                    repoHelper.buildDockerImageAndTagRepo(build_config, true, build_args)
                }
                echo "finish ===> 1. checkout code, build image, push image and tag repo"
            }
        }

        stage('2. deploy') {
            container('kubectl') {
                echo "start ===> 2. deploy in eks"

                dir(repo_name) {
                    // 2.1 config aws
                    echo "start ===> 2.1 config kubectl"
                    eksHelper.initKubectlClient(eks_config, deploy_env)

                    // 2.2. apply service
                    echo "start ===> 2.2. apply service"
                    env.IMAGE_TAG = "${build_config.image_tag}"
                    env.OVERLAY = "${branch_name}"

                    // update service-logging/base/base.yml
                            sh 'mv deploy/kustomize/orca-db-services/base/base.yml deploy/kustomize/orca-db-services/base/base.yml.bak \
                        && \
                        cat deploy/kustomize/orca-db-services/base/base.yml.bak \
                        | python3 /opt/warrior/replacer.py --o "###IMAGE_TAG###" --n "${IMAGE_TAG}" \
                        > deploy/kustomize/orca-db-services/base/base.yml'

                    sh 'kubectl kustomize deploy/kustomize/orca-db-services/overlays/${OVERLAY} | kubectl apply -f -'
                }
                echo "finish ===> 2. deploy in eks"
            }
        }
    }
}