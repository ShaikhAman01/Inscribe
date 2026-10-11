import { Link } from "react-router-dom";
import LegalPage from "../components/LegalPage";
import { CONTACT_EMAIL } from "../lib/links";

const Terms = () => (
  <LegalPage
    title="Terms of use"
    updated="October 9, 2026"
    intro="Inscribe is a free, open-source project run by one developer. These terms are short and in plain language: be kind, own what you write, and know that it's offered as is."
  >
    <section>
      <h2>Your content stays yours</h2>
      <p>
        You keep the rights to everything you write. By publishing, you allow Inscribe to store and display it publicly, and to send its text to
        an AI model when someone asks for a summary. Deleting a story ends that permission.
      </p>
    </section>

    <section>
      <h2>Be decent</h2>
      <ul>
        <li>Don't post anything illegal, hateful, harassing, sexually explicit, or that shares someone's private information.</li>
        <li>Don't post content you don't have the right to share.</li>
        <li>Don't spam, scrape aggressively, or try to break or overload the service.</li>
      </ul>
      <p>Content or accounts that break these rules may be removed without notice.</p>
    </section>

    <section>
      <h2>Your account</h2>
      <p>
        Keep your password to yourself; you're responsible for what's posted from your account. You can delete your account and everything in
        it at any time from the account menu. The <Link to="/privacy">privacy policy</Link> explains what that removes.
      </p>
    </section>

    <section>
      <h2>No guarantees</h2>
      <p>
        Inscribe is provided as is, without warranties. It may change, go offline, or lose data, so keep your own copy of anything important.
        AI summaries are generated automatically and can be wrong.
      </p>
    </section>

    <section>
      <h2>Contact</h2>
      <p>
        Questions, reports or takedown requests: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </section>
  </LegalPage>
);

export default Terms;
