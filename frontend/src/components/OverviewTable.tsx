import React from 'react';
import {Skeleton, Table, Title, Anchor} from '@mantine/core';
import moment from 'moment';

type Props = {
    url?: {
        id: string,
        url: string,
        max_forwards: number,
        remaining_forwards: number,
        created_at: string
        updated_at: string
    }
    publicUrl?: string
}

const Stats = ({label, value}: { label: string, value: string | React.ReactNode }) => {
    return (<tr>
        <td style={{width: "200px"}}><Title order={5}>{label}</Title></td>
        <td>{value}</td>
    </tr>)
}


export default function OverviewTable({url, publicUrl}: Props) {
    if (!url) {
        return (<Table>
            <tbody>
            <Stats label="ID" value={<Skeleton width={200} height={20}  />}/>
            <Stats label="Remaining views" value={<Skeleton width={50} height={20} />}/>
            <Stats label="Max views" value={<Skeleton width={50} height={20} />}/>
            <Stats label="Target URL" value={<Skeleton width={200} height={20} />}/>
            <Stats label="Created" value={<Skeleton width={200} height={20} />}/>
            <Stats label="Last viewed" value={<Skeleton width={200} height={20} />}/>
            <Stats label="Test link" value={<Skeleton width={200} height={20} />}/>
            </tbody>
        </Table>)
    }

    return (
        <Table>
            <tbody>
            <Stats label="ID" value={url.id}/>
            <Stats label="Remaining views" value={String(url.remaining_forwards)}/>
            <Stats label="Max views" value={String(url.max_forwards)}/>
            <Stats label="Target URL" value={url.url}/>
            <Stats label="Created" value={moment(url.created_at).fromNow()}/>
            <Stats label="Last viewed" value={moment(url.updated_at).fromNow()}/>
            <Stats label="Test redirect" value={
                <><Anchor size="sm" href={publicUrl} target="_blank">Link </Anchor>
                    (opens in a new window)
                </>
            }/>
            </tbody>
        </Table>
    )
};
