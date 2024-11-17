import { useQuery } from '@tanstack/react-query';

type DataType = {
    [key: string]: any;
};

const fetchData = async (): Promise<DataType> => {
    const response = await fetch('http://localhost:8081/hello');
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

function HelloWorld() {
    const { data, error, isLoading } = useQuery<DataType>({
        queryKey: ['fetchData'],
        queryFn: fetchData,
    });

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {(error as Error).message}</p>;
    }

    return (
        <div>
            <h2>Fetched Data</h2>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
}

export default HelloWorld;
