import { Edge, Node, ClusterNode } from '@swimlane/ngx-graph';

export const nodes: Node[] = [
    {
        id: '1',
        label: 'Teroy Taeza'
    }, {
        id: '2',
        label: 'Lemuel Taeza'
    }, {
        id: '3',
        label: 'Cel Taeza'
    } , {
        id: '4',
        label: 'Pencing Brillantes'
    }, {
        id: '5',
        label: 'Rosa Torres'
    }, {
        id: '6',
        label: 'Cynthia Torress'
    }
];

export const clusters: ClusterNode[] = [

]

export const links: Edge[] = [
    {
        id: 'a',
        source: '1',
        target: '2',
        label: 'is child of'
    },
    {
        id: 'b',
        source: '2',
        target: '3',
        label: 'is child of'
    },
    {
        id: 'c',
        source: '3',
        target: '4',
        label: 'is child of'
    },
    {
        id: 'd',
        source: '4',
        target: '5',
        label: 'is sibling of'
    }
    , {
        id: 'e',
        source: '5',
        target: '6',
        label: 'is child of'
    }
];