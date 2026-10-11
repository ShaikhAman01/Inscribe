import { Link } from "react-router-dom";
import LegalPage from "../components/LegalPage";
import { CONTACT_EMAIL, REPO_URL } from "../lib/links";

const Privacy = () => (
  <LegalPage
    title="Privacy policy"
    updated="October 9, 2026"
    intro="Inscribe is a small, open-source writing app built by one developer. It collects only what it needs to let you write, read and react to stories, and nothing is sold or used for advertising."
  >
    <section>
      <h2>What you share with us</h2>
      <ul>
        <li><strong>Your account:</strong> email address, display name and password. Passwords are never stored as typed; only a salted PBKDF2-SHA256 hash is kept.</li>
        <li><strong>What you write:</strong> stories, their tags, comments and likes, with the time each was created.</li>
      </ul>
      <p>Stories, comments and your display name are public, which is the point of a blog. Your email address is never shown to anyone.</p>
    </section>

    <section>
      <h2>What stays in your browser</h2>
      <p>
        When you sign in, a sign-in token and your display name are saved in your browser's local storage so you stay signed in. The token
        expires after 7 days. Signing out removes both. Inscribe sets no cookies.
      </p>
    </section>

    <section>
      <h2>Services that help run Inscribe</h2>
      <ul>
        <li><strong>Cloudflare</strong> runs the API. It sees standard request details such as your IP address, and keeps error logs for a few days. Passwords and story text are never written to those logs.</li>
        <li><strong>Cloudflare Workers AI</strong> generates summaries. When someone asks for one, the story's text (up to about 6,000 characters) is sent to the model, and the summary is cached for up to 7 days.</li>
        <li><strong>A managed PostgreSQL database</strong>, reached through Prisma Accelerate, stores accounts and content.</li>
        <li><strong>Vercel</strong> hosts the website and provides Vercel Web Analytics, which counts page views without cookies and without identifying you.</li>
      </ul>
    </section>

    <section>
      <h2>Rate limits</h2>
      <p>
        To stop spam and password guessing, your IP address or account ID is held in memory for about a minute while requests are counted. It
        is never written to the database.
      </p>
    </section>

    <section>
      <h2>Deleting your data</h2>
      <p>
        You can delete any of your stories or comments at any time. To remove everything, open the account menu and choose{" "}
        <strong>Delete account</strong>: your account, stories, comments and likes are erased immediately. If you can't sign in, email{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and it will be handled by hand.
      </p>
    </section>

    <section>
      <h2>Questions and changes</h2>
      <p>
        The full source code is on <a href={REPO_URL} target="_blank" rel="noreferrer">GitHub</a>, so you can check every claim on this page.
        If anything changes, this page and its date will be updated. Questions go to{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. See also the <Link to="/terms">terms of use</Link>.
      </p>
    </section>
  </LegalPage>
);

export default Privacy;
