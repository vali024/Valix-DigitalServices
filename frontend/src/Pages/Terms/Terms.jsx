import "./Terms.css";

const Terms = () => {
  return (
    <div className="terms-container">
      <div className="terms-header">
        <h1>Terms & Conditions</h1>
      </div>

      <div className="terms-content">
        <section>
          <h2>1. Introduction</h2>
          <p>
            Welcome to Valix Tech. By accessing and using our website and
            digital services, including web development, mobile development, digital marketing,
            and content creation services, you agree to be bound by these Terms and Conditions.
          </p>
        </section>

        <section>
          <h2>2. Service Terms</h2>
          <ul>
            <li>Project requirements must be clearly defined before commencement</li>
            <li>Project timelines and deliverables will be specified in the service agreement</li>
            <li>Service costs are based on project scope and complexity</li>
            <li>Regular progress updates will be provided throughout the development process</li>
            <li>Changes to project scope may affect timeline and pricing</li>
          </ul>
        </section>

        <section>
          <h2>3. Service Quality</h2>
          <ul>
            <li>We guarantee professional quality work that meets industry standards</li>
            <li>All deliverables undergo thorough quality assurance testing</li>
            <li>
              Any issues must be reported within 14 days of project delivery for free revisions
            </li>
            <li>
              We maintain regular communication throughout the development process
            </li>
          </ul>
        </section>

        <section>
          <h2>4. Payment Terms</h2>
          <ul>
            <li>
              We accept various payment methods including UPI, credit/debit cards, net banking, and COD
            </li>
            <li>All prices are inclusive of applicable taxes</li>
            <li>Prices are subject to change without prior notice</li>
            <li>For COD orders, please keep exact change ready</li>
            <li>Payment confirmation will be sent via email/SMS</li>
          </ul>
        </section>

        <section>
          <h2>5. Cancellation & Refunds</h2>
          <ul>
            <li>Projects can be cancelled before development phase begins with full refund</li>
            <li>Mid-project cancellations are subject to payment for work completed</li>
            <li>Refunds will be processed within 5-7 business days</li>
            <li>
              Cancellation fees may apply based on project progress and resources allocated
            </li>
          </ul>
        </section>

        <section>
          <h2>6. Intellectual Property</h2>
          <ul>
            <li>
              Client retains ownership of their original content and materials
            </li>
            <li>
              Final deliverables become client property after full payment
            </li>
            <li>
              We retain the right to showcase completed projects in our portfolio
            </li>
            <li>
              Third-party licenses and assets will be properly documented
            </li>
          </ul>
        </section>

        <section>
          <h2>7. Confidentiality</h2>
          <ul>
            <li>
              We maintain strict confidentiality of client information and project details
            </li>
            <li>
              Non-disclosure agreements available upon request
            </li>
            <li>
              Client data is securely stored and handled as per privacy laws
            </li>
          </ul>
        </section>

        <section>
          <h2>8. Modifications</h2>
          <p>
            We reserve the right to modify these terms at any time. Continued
            use of our services after changes constitutes acceptance of the
            modified terms.
          </p>
        </section>

        <div className="terms-footer">
          <p>Last updated: August 2025</p>
          <p>
            For any questions regarding these terms, please contact us at
            lovelyboyarun91@gmail.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;
