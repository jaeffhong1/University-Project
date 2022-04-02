export default function Home() {
    return (
        <main className='main' style={{padding: '1em'}}>
            <h2>Welcome to the Disease Dashboard</h2>
            <p>
                This is some text here.
            </p>

            <h3>Ideas:</h3>
            <ul>
                <li>Page per disease: shows rundown of:
                    <ul>
                        <li>common symptoms</li>
                        <li>locations
                            <ul>
                                <li>Current:
                                    <ul>
                                        <li>Pie chart of what countries the disease is in</li>
                                    </ul>
                                </li>
                                <li>Historical:
                                    <ul>
                                        <li>Horizontal scroll bar for the current date starting that can be animated to move on its own.</li>
                                        <li>Can change dispaly to bar chart, "country blob", horizontal bar chart for top 10 countries</li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                        <li>~level of contagiousness/spreadability</li>
                    </ul>
                </li>
            </ul>
        </main>
    );
}