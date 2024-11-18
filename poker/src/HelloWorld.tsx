import { useQuery } from '@tanstack/react-query';

type DataType = {
    message: string;
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

    // Add a check to ensure data is defined before accessing `data.message`
    if (!data) {
        return <p>No data available</p>;
    }

    return (
        <div>
            <h2>Fetched Data</h2>
            <div>{data.message}</div> {/* Safely access `data.message` */}
        </div>
    );
}

export default HelloWorld;
