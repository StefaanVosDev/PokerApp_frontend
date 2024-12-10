import { Trophy, Users, Zap, Shield } from 'lucide-react';
import './Features.scss';

function Features() {
    const features = [
        {
            icon: <Users className="icon" />,
            title: "Active Community",
            description: "Join thousands of active players from around the world",
        },
        {
            icon: <Trophy className="icon" />,
            title: "Daily Tournaments",
            description: "Compete in daily tournaments with massive prize pools",
        },
        {
            icon: <Zap className="icon" />,
            title: "Fast-Paced Action",
            description: "Experience smooth gameplay with no delays",
        },
        {
            icon: <Shield className="icon" />,
            title: "Secure Gaming",
            description: "Play with confidence with our secure platform",
        },
    ];

    return (
        <section className="features" id="features">
            <div className="features-container">
                <div className="features-header">
                    <h2 className="features-title">Why Choose Stacks?</h2>
                </div>

                <div className="features-grid">
                    {features.map((feature, index) => (
                        <div key={index} className="feature-card">
                            <div className="feature-icon">{feature.icon}</div>
                            <h3 className="feature-title">{feature.title}</h3>
                            <p className="feature-description">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Features;
