import { useSubscription, gql } from "@apollo/client";

const SUBSCRIPTION = gql`
subscription CPU {
cpu {
    percentage
}
}
`;

function LatestComment() {
    const { data, loading } = useSubscription(
        SUBSCRIPTION,
    );
    return !loading && data.commentAdded.content 
}