import AddExpenseForm from "@/components/forms/AddExpenseForm"

const Dashboard = () => {
    return (
        <div className="container mx-auto">
            <h4 className="text-2xl font-bold mt-8"> Dashboard </h4>
            <AddExpenseForm />
        </div>
    )
}

export default Dashboard
