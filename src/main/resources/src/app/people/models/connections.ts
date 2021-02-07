import { ClusterNode, Edge, Node } from '@swimlane/ngx-graph';

export class Connection {
    status: string;
    relationLabel: string;
    links: Edge[];
    nodes: Node[];
    clusters: ClusterNode[];

}
