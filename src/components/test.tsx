// Test de typage TypeScript
interface Props {
    name: string
    age: number
    } export function TestComponent({ name, age }: Props) {
    return (
    <div>
    <p>Name: {name}</p>
    <p>Age: {age}</p>
    </div>
    )
    }