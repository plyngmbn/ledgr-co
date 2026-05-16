import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12 text-gray-800 dark:text-gray-200">
      <Link href="/" className="text-[#4A9B7F] hover:underline mb-8 inline-block font-medium">
        ← Back to Dashboard
      </Link>
      
      <h1 className="text-4xl font-bold mb-6 font-[family-name:var(--font-pixel)] text-[#4A9B7F]">
        Privacy Policy
      </h1>
      
      <div className="space-y-6 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold mb-2">Introduction</h2>
          <p>
            At Ledgr, we value your privacy. This policy explains how we collect and use your data 
            when you use our application.
          </p>
        </section>

        <section className="bg-green-50 dark:bg-gray-900 p-4 rounded-lg border border-green-100 dark:border-gray-800">
          <h2 className="text-xl font-semibold mb-2">Google AdSense & Cookies</h2>
          <p>
            We use Google AdSense to serve ads on our site. Google uses cookies to serve ads based 
            on a user's prior visits to our website or other websites. Google's use of advertising 
            cookies enables it and its partners to serve ads to our users based on their visit to 
            our sites and/or other sites on the Internet.
          </p>
          <p className="mt-2">
            Users may opt out of personalized advertising by visiting{" "}
            <a href="https://www.google.com/settings/ads" target="_blank" className="text-[#4A9B7F] underline">
              Google Ads Settings
            </a>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Data Collection</h2>
          <p>
            Ledgr helps you track expenses. Any financial data you enter is stored locally or synced via 
            secure cloud providers to ensure you can access your budget across devices. We do not sell your 
            personal financial data to third parties.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
          <p>
            If you have questions regarding this policy, you can reach out via our GitHub repository or contact 
            the site administrator.
          </p>
        </section>
      </div>
      
      <p className="mt-12 text-sm text-gray-500">Last updated: May 2026</p>
    </main>
  );
}