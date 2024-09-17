import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'downloads' })
export class Downloads {
    @PrimaryColumn({ name: 'imdbid', length: 255 })
    imdbid: string;

    @Column({ name: 'title', length: 255 })
    title: string;

    @Column({ name: 'download_file_size', type: 'bigint' })
    downloadFileSize: number;

    @Column({ name: 'downloaded_file_size', type: 'bigint', default: 0 })
    downloadedFileSize: number;
    
    @Column({ name: 'download_start_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    downloadStartAt: Date;

    @Column({ name: 'download_is_complete', type: 'boolean', default: false })
    downloadIsComplete: boolean;

    @Column({ name: 'download_finished_at', type: 'timestamp', nullable: true })
    downloadFinishedAt: Date | null;

    @Column({ name: 'fragmentation_process', type: 'boolean', default: false })
    fragmentationProcess: boolean;

    @Column({ name: 'fragmentation_is_complete', type: 'boolean', default: false })
    fragmentationIsComplete: boolean;

    @Column({ name: 'fragmentation_started_at', type: 'timestamp', nullable: true })
    fragmentationStartedAt: Date | null;

    @Column({ name: 'fragmentation_finished_at', type: 'timestamp', nullable: true })
    fragmentationFinishedAt: Date | null;

    @Column({ name: 'fragmentation_error', type: 'text', nullable: true })
    fragmentationError: string | null;

    @Column({ name: 'is_declined', type: 'boolean', default: false })
    isDeclined: boolean;
}