import { Dockerode } from 'dockerode';

// Pipeline monitor and control class for spawning and managing child processes
export class PipelineMonitor{
    private readonly DOCKER_HOST: string = process.env.DOCKER_HOST || 'localhost';
    private readonly DOCKER_PORT: string = process.env.DOCKER_PORT || '2375';
    private readonly DOCKER_PROTOCOL: string = process.env.DOCKER_PROTOCOL || 'tcp';

    constructor(private readonly dockerode: Dockerode) {
        if (process.env.DOCKER_SOCKET)
            dockerode = new Dockerode({socketPath: process.env.DOCKER_SOCKET});
        else dockerode = new Dockerode({host: this.DOCKER_HOST, port: this.DOCKER_PORT, protocol: this.DOCKER_PROTOCOL});
    }

    // pull image from dockerhub
    async pullImage(imageName: string): Promise<void> {
        return this.dockerode.pull(imageName);
    }

    // run pipiline container with given image name, and data volumes
    async runPipeline(imageName: string, provided_by: string, project_id: string): Promise<void> {
        const volumeName: string = `/${provided_by}/${project_id}`;

        const volumes = {}

        volumes[`${volumeName}/fastq`] = '/vigilant/fastq_pass';
        volumes[`${volumeName}/summary`] = '/vigilant/summary';
        volumes[`${volumeName}/sample_sheet`] = '/vigilant/sample_sheet';
        volumes[`${volumeName}/out`] = '/vigilant/out';
        volumes[`${volumeName}/variant`] = '/vigilant/variants';

        return this.dockerode.run(imageName, [], process.stdout, {Volumes: volumes});
    }
}