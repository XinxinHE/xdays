const e = React.createElement;

const AppNav = () => (
    <nav class="navbar navbar-dark bg-dark">
        <a class="navbar-brand" href="#">XDay</a>
        <a role="button" class="btn btn-outline-info navbar-btn" href="/login">Login</a>
    </nav>
);

const Card = ({ item }) => {
    const { title, content } = item;
    return (
        <div class="card mt-4" Style="width: 100%;">
            <div class="card-body">
                <h5 class="card-title">{title || "No Title"}</h5>
                <p class="card-text">{content || "No Content"}</p>
            </div>
        </div>
    )
}

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data: [] };
    }

    componentDidMount() {
        this.getPosts();
    }

    getPosts = async () => {
        const response = await fetch('/posts');
        const data = await response.json();
        this.setState({ data })
    }

    render() {
        return (
            <div>
                <AppNav />
                {
                    this.state.data.length > 0 ? (
                        this.state.data.map(item => 
                            <Card item={item} />)
                    ) : (
                            <div class="card mt-5 col-sm">
                                <div class="card-body">This user doesn't have any posts yet.</div>
                            </div>
                        )
                }
            </div>
        );
    }
}

const domContainer = document.querySelector('#root');
ReactDOM.render(e(Home), domContainer);