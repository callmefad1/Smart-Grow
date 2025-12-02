
import '../styles/notfound.css';

function NotFound() {
    return (
        <div className="notfound-root">
            

            <div className="notfound-container">
                <div className="notfound-emoji">😕</div>
                <h1 className="notfound-code">404</h1>
                <h2 className="notfound-title">Page Not Found</h2>
                <p className="notfound-message">Sorry, the page you are looking for does not exist.</p>
                <div>
                    <a href="/dashboard" className="notfound-button">Go Home</a>
                </div>
            </div>
        </div>
    );
}

export default NotFound;