import "./Privacy.css";

const Privacy = () => {
  return (
    <div className="privacy-container">
      <div className="privacy-header">
        <h1>Privacy Policy</h1>
      </div>

      <div className="privacy-content">
        <section>
          <h2>1. Information We Collect</h2>
          <p>
            At Valix Tech, we collect information that helps us provide and
            improve our digital services:
          </p>
          <ul>
            <li>Personal information (name, email, phone number, company details)</li>
            <li>Project requirements and preferences</li>
            <li>Technical specifications and project documentation</li>
            <li>Device information and analytics data (with consent)</li>
            <li>
              Payment information (processed securely through our payment
              partners)
            </li>
          </ul>
        </section>

        <section>
          <h2>2. How We Use Your Information</h2>
          <ul>
            <li>Develop and deliver your digital solutions</li>
            <li>Provide project updates and development progress</li>
            <li>Improve our development processes and services</li>
            <li>Share relevant technical updates and service improvements</li>
            <li>Maintain project security and prevent unauthorized access</li>
            <li>Analyze and enhance service performance</li>
          </ul>
        </section>

        <section>
          <h2>3. Information Sharing</h2>
          <p>
            We do not sell your personal information or project data. We may share your
            information with:
          </p>
          <ul>
            <li>Development team members working on your project</li>
            <li>Secure cloud service providers for hosting</li>
            <li>Payment processors for transactions</li>
            <li>Third-party tools and services essential for development</li>
            <li>Legal authorities when required by law</li>
          </ul>
        </section>

        <section>
          <h2>4. Data Security</h2>
          <ul>
            <li>Implementation of industry-standard encryption and security protocols</li>
            <li>Regular security audits and vulnerability assessments</li>
            <li>Secure code practices and version control</li>
            <li>Secure payment processing through trusted partners</li>
            <li>
              Strict access controls and authentication for project resources
            </li>
            <li>
              Regular backups and disaster recovery procedures
            </li>
          </ul>
        </section>

        <section>
          <h2>5. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal information</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Opt-out of marketing communications</li>
            <li>Export your data in a portable format</li>
          </ul>
        </section>

        <section>
          <h2>6. Cookies and Tracking</h2>
          <p>We use cookies and similar technologies to:</p>
          <ul>
            <li>Remember your preferences and login status</li>
            <li>Analyze site usage and performance metrics</li>
            <li>Enhance development and debugging processes</li>
            <li>Provide personalized user experiences</li>
            <li>Monitor application performance and errors</li>
          </ul>
        </section>

        <section>
          <h2>7. Data Retention</h2>
          <p>
            We retain your information and project data for as long as necessary to:
          </p>
          <ul>
            <li>Complete your project and provide ongoing support</li>
            <li>Comply with legal obligations</li>
            <li>Resolve disputes and enforce agreements</li>
            <li>Maintain project documentation and backups</li>
          </ul>
        </section>

        <section>
          <h2>8. Updates to Privacy Policy</h2>
          <p>
            We may update this policy periodically. We will notify you of
            significant changes through our website or email.
          </p>
        </section>

        <div className="privacy-footer">
          <p>Last updated: August 2025</p>
          <p>
            For privacy concerns, please contact us at support@valixtech.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
