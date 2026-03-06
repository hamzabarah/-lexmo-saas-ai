import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-gray-700 py-16 px-4 font-cairo" dir="ltr">
      <div className="mx-auto" style={{ maxWidth: '800px' }}>

        {/* Back link */}
        <Link href="/" className="inline-block text-[#C5A04E] text-sm font-semibold hover:underline mb-8">
          &larr; Back to Home
        </Link>

        {/* Title */}
        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
          Terms and Conditions of Sale and Use — ECOMY
        </h1>
        <p className="text-sm text-gray-500 mb-12">Last updated: March 2026 — Version 3.1</p>

        <div className="space-y-10 text-[15px] leading-[1.85]">

          {/* Article 1 */}
          <section>
            <h2 className="text-xl font-bold text-[#C5A04E] mb-3">Article 1 — Seller Identification and Scope</h2>
            <p>These Terms and Conditions of Sale and Use (hereinafter &quot;T&amp;C&quot;) govern all contractual relationships between HAMZA SHOP (hereinafter &quot;the Seller&quot; or &quot;ECOMY&quot;) and any individual or legal entity purchasing a digital product or service through the platform accessible at lexmo.ai (hereinafter &quot;the Platform&quot;).</p>
            <p className="mt-3">By completing any purchase on the Platform, the Customer fully, unconditionally and unreservedly accepts these T&amp;C in their entirety. The Customer declares having read these T&amp;C prior to any purchase. If the Customer disagrees with any provision herein, they are advised not to proceed with the purchase.</p>
            <p className="mt-3">These T&amp;C supersede all other documents, including any Customer purchase terms. The Seller reserves the right to modify these T&amp;C at any time. The applicable T&amp;C are those in force at the time of purchase.</p>
            <p className="mt-3">The Seller&apos;s full contact details are available in the Legal Notice section of the Platform.</p>
          </section>

          {/* Article 2 */}
          <section>
            <h2 className="text-xl font-bold text-[#C5A04E] mb-3">Article 2 — Description of the Digital Product</h2>
            <p>ECOMY markets an online training course on e-commerce, consisting of:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-500">
              <li>Twenty-seven (27) progressive learning modules</li>
              <li>More than one hundred and twenty (120) practical video lessons</li>
              <li>Downloadable PDF documents and course materials</li>
              <li>Assessment exercises and interactive quizzes</li>
              <li>Access to the online learning platform</li>
            </ul>
            <p className="mt-3">The selling price of the training is one hundred and ninety-seven euros (€197.00) including all taxes, payable in a single installment at the time of purchase.</p>
            <p className="mt-3">The product is an intangible digital good. In accordance with Article L.221-28 of the French Consumer Code and Article 16(m) of European Directive 2011/83/EU, access to this digital content is activated immediately and automatically upon payment confirmation, after the Customer&apos;s express consent. This immediate activation carries the consequences described in Article 5 herein.</p>
          </section>

          {/* Article 3 */}
          <section>
            <h2 className="text-xl font-bold text-[#C5A04E] mb-3">Article 3 — Order Process and Contract Formation</h2>
            <p>The contract is formed when the Customer definitively validates their order on the payment platform. Prior to this validation, the Customer:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-500">
              <li>Has read and expressly accepted these T&amp;C by checking the box provided for this purpose</li>
              <li>Has confirmed understanding and acceptance of the no-refund policy</li>
              <li>Has expressly consented to the immediate activation of the digital content</li>
              <li>Has acknowledged thereby waiving their right of withdrawal</li>
            </ul>
            <p className="mt-3">The order confirmation is sent to the Customer by email at the address provided at the time of purchase. The Seller reserves the right to refuse or cancel any order for legitimate reasons.</p>
          </section>

          {/* Article 4 */}
          <section>
            <h2 className="text-xl font-bold text-[#C5A04E] mb-3">Article 4 — Pricing, Payment and Transaction Security</h2>
            <p>The price displayed on the Platform is expressed in euros including all taxes. The Seller reserves the right to modify prices at any time, it being understood that the applicable price is that in force at the time the order is validated.</p>
            <p className="mt-3">Payment is made exclusively by credit card via the secure Stripe, Inc. platform. The Seller does not retain any banking data from the Customer. The transaction is secured by SSL protocol and PCI-DSS standards. Any attempt at fraud or misuse will be subject to legal proceedings.</p>
            <p className="mt-3">In the event of non-payment or bank rejection, the Seller reserves the right to immediately suspend access to the training and to initiate any necessary recovery procedure, including legal action.</p>
          </section>

          {/* Article 5 */}
          <section>
            <h2 className="text-xl font-bold text-[#C5A04E] mb-3">Article 5 — No-Refund Policy and Right of Withdrawal</h2>

            <h3 className="text-base font-bold text-white mt-4 mb-2">5.1 — Legal Basis</h3>
            <p>In accordance with Article L.221-28, 13° of the French Consumer Code and Article 16(m) of European Directive 2011/83/EU on consumer rights, the right of withdrawal does not apply to contracts for the supply of digital content not supplied on a tangible medium, the performance of which has begun with the consumer&apos;s prior express agreement and acknowledgment that they will thereby lose their right of withdrawal.</p>

            <h3 className="text-base font-bold text-white mt-4 mb-2">5.2 — Express and Irrevocable Waiver</h3>
            <p>By proceeding with payment, the Customer expressly and irrevocably acknowledges and accepts that:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-500">
              <li>Access to digital content is activated immediately and automatically upon payment confirmation</li>
              <li>The digital content is deemed fully delivered and consumed upon activation of access</li>
              <li>The Customer expressly and definitively waives any right of withdrawal</li>
              <li>No refund will be granted after activation of access, under any circumstances whatsoever</li>
              <li>This waiver is final, unconditional and not subject to subsequent retraction</li>
            </ul>

            <h3 className="text-base font-bold text-white mt-4 mb-2">5.3 — Absolute No-Refund Policy</h3>
            <p>The Seller applies a strict and absolute no-refund policy. No refund will be granted notably in the following cases, this list not being exhaustive:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-500">
              <li>Subjective dissatisfaction of the Customer regarding the content of the training</li>
              <li>Absence of financial or commercial results</li>
              <li>Technical difficulties related to the Customer&apos;s equipment or internet connection</li>
              <li>Change in the Customer&apos;s personal or professional situation</li>
              <li>Customer&apos;s misjudgment regarding the suitability of the training for their needs</li>
              <li>Total or partial non-use of the content by the Customer</li>
              <li>Any other reason invoked by the Customer after activation of access</li>
            </ul>

            <h3 className="text-base font-bold text-white mt-4 mb-2">5.4 — Strictly Limited Exceptions</h3>
            <p>On an exceptional and discretionary basis, the Seller may examine — without any obligation to act — the following situations, provided they are reported within forty-eight (48) hours of purchase:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-500">
              <li>Serious and documented technical failure of the platform totally preventing access to the content for more than seven (7) consecutive days, exclusively attributable to the Seller</li>
              <li>Proven double charge for the same order, justified by an official bank statement</li>
            </ul>
            <p className="mt-3">Any request must be sent to the address indicated in the Platform&apos;s Legal Notice, accompanied by supporting evidence. The decision to grant a refund in these exceptional cases is at the sole discretion of the Seller.</p>
          </section>

          {/* Article 6 */}
          <section>
            <h2 className="text-xl font-bold text-[#C5A04E] mb-3">Article 6 — Bank Dispute Procedure (Chargeback)</h2>
            <p>The Seller expressly draws the Customer&apos;s attention to the serious consequences of an unjustified bank dispute (chargeback) procedure.</p>
            <p className="mt-3">In the event of a chargeback initiated by the Customer after activation of access to the digital content, the Seller will:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-500">
              <li>Submit to the banking institution all evidence of activation and access to the content (timestamped server logs, IP addresses, connection history)</li>
              <li>Produce proof of the Customer&apos;s express acceptance of these T&amp;C, including waiver of the right of withdrawal</li>
              <li>Invoke the exception provided for in Article 16(m) of Directive 2011/83/EU and Article L.221-28 of the French Consumer Code</li>
              <li>Immediately and permanently suspend the Customer&apos;s access to the training and all associated services</li>
              <li>Reserve the right to initiate any appropriate legal proceedings to recover amounts due and obtain compensation for damages suffered</li>
            </ul>
            <p className="mt-3">The Customer acknowledges that initiating an unjustified chargeback constitutes a characterised fraud and may engage their civil and criminal liability. The Seller has all technical data to demonstrate effective access to the digital content.</p>
          </section>

          {/* Article 7 */}
          <section>
            <h2 className="text-xl font-bold text-[#C5A04E] mb-3">Article 7 — Intellectual Property and License of Use</h2>
            <p>All content comprising the training (videos, texts, images, PDFs, logos, trademarks, trade names, interfaces) is the exclusive property of the Seller and is protected by intellectual property law, including copyright, trademark law and sui generis database rights.</p>
            <p className="mt-3">The Seller grants the Customer a personal, non-exclusive, non-transferable, non-sublicensable and revocable limited license to access and use the training content, solely for personal and private learning purposes, for the duration provided in Article 8 herein.</p>
            <p className="mt-3">The following are strictly prohibited for the Customer, under penalty of immediate termination of access without refund and legal proceedings:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-500">
              <li>Reproducing, copying, duplicating or downloading all or part of the content</li>
              <li>Distributing, broadcasting, publishing or sharing the content by any means whatsoever</li>
              <li>Selling, renting, sublicensing or transferring the content or access rights</li>
              <li>Recording or capturing videos by any technical means</li>
              <li>Creating derivative works from the content</li>
              <li>Sharing login credentials with third parties</li>
              <li>Using the content for unauthorized commercial or professional purposes</li>
            </ul>
          </section>

          {/* Article 8 */}
          <section>
            <h2 className="text-xl font-bold text-[#C5A04E] mb-3">Article 8 — Duration of Access and Termination Conditions</h2>
            <p>Access to the training is granted for a fixed period of six (6) months from the activation date. Upon expiry, the Seller reserves the right to delete access without notice or compensation. The Customer may renew their access by purchasing the training again at the then-current prices.</p>
            <p className="mt-3">The Seller reserves the right to immediately terminate access without notice in case of:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-500">
              <li>Violation of any provision of these T&amp;C</li>
              <li>Unauthorized sharing of login credentials</li>
              <li>Attempt to download or copy content</li>
              <li>Initiation of a chargeback procedure</li>
              <li>Any fraudulent or harmful behavior toward the Seller</li>
            </ul>
            <p className="mt-3">Termination for breach results in permanent loss of access without refund and does not preclude legal proceedings.</p>
          </section>

          {/* Article 9 */}
          <section>
            <h2 className="text-xl font-bold text-[#C5A04E] mb-3">Article 9 — Limitation of Liability and Results Disclaimer</h2>
            <p>The training content is provided for purely educational and informational purposes. The Seller does not guarantee the achievement of specific financial, commercial or professional results following the training.</p>
            <p className="mt-3">The Customer expressly acknowledges and accepts that:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-500">
              <li>Examples of results and figures presented in marketing materials are illustrations for indicative purposes only and do not constitute a promise of results</li>
              <li>Success depends exclusively on personal effort, investment, skills and market conditions specific to each Customer</li>
              <li>The Seller is not responsible for financial losses, direct or indirect, that may result from applying the strategies taught</li>
              <li>The training does not constitute financial, tax, legal or accounting advice</li>
              <li>Results vary significantly from one individual to another</li>
            </ul>
            <p className="mt-3">The Seller&apos;s liability, for any reason whatsoever, is expressly limited to the amount paid by the Customer for the training (€197). The Seller shall not be liable for indirect, consequential, special or exemplary damages.</p>
          </section>

          {/* Article 10 */}
          <section>
            <h2 className="text-xl font-bold text-[#C5A04E] mb-3">Article 10 — Personal Data Protection</h2>
            <p>In the context of the performance hereof, the Seller collects and processes the Customer&apos;s personal data in accordance with the General Data Protection Regulation (GDPR — EU Regulation 2016/679) and the French Data Protection Act.</p>
            <p className="mt-3">Data collected (name, email address, country of residence, IP address, connection and payment data) is used exclusively for contract performance, access management, and compliance with the Seller&apos;s legal obligations.</p>
            <p className="mt-3">The Customer has the right to access, rectify, erase and port their data, as well as the right to object to its processing. These rights may be exercised by sending a written request to the address indicated in the Platform&apos;s Legal Notice.</p>
            <p className="mt-3">Payment data is processed exclusively by Stripe, Inc., in accordance with its own privacy policies and PCI-DSS standards. The Seller retains no banking data.</p>
          </section>

          {/* Article 11 */}
          <section>
            <h2 className="text-xl font-bold text-[#C5A04E] mb-3">Article 11 — Force Majeure</h2>
            <p>The Seller shall not be held liable for non-performance or delay in performance of its obligations in the event of a force majeure event as defined by Article 1218 of the French Civil Code, including natural disasters, war, pandemic, digital infrastructure failure, cyberattack or any other unforeseeable and insurmountable event.</p>
          </section>

          {/* Article 12 */}
          <section>
            <h2 className="text-xl font-bold text-[#C5A04E] mb-3">Article 12 — Governing Law, Jurisdiction and Mediation</h2>
            <p>These T&amp;C are governed by French law. In the event of a dispute relating to the interpretation, validity or performance hereof, the parties undertake to seek an amicable solution prior to any legal action.</p>
            <p className="mt-3">Failing amicable agreement within thirty (30) days of notification of the dispute, any disagreement shall be submitted to the exclusive jurisdiction of the courts of the Seller&apos;s registered office, even in the case of multiple defendants or warranty claims, notwithstanding any contrary clause.</p>
            <p className="mt-3">In accordance with the Consumer Code provisions on amicable dispute resolution, the Customer may resort free of charge to the mediation service whose contact details are available on the Platform.</p>
          </section>

          {/* Article 13 */}
          <section>
            <h2 className="text-xl font-bold text-[#C5A04E] mb-3">Article 13 — Miscellaneous Provisions</h2>
            <p>If any provision of these T&amp;C is declared null or unenforceable by a competent court, the remaining provisions shall remain in full force. Partial nullity shall not entail nullity of these T&amp;C as a whole.</p>
            <p className="mt-3">The Seller&apos;s failure to invoke any clause of these T&amp;C at any given time shall not be construed as a waiver of the right to invoke said clause subsequently.</p>
            <p className="mt-3">These T&amp;C constitute the entire agreement between the parties regarding their subject matter and supersede all prior agreements, written or oral, on the same subject.</p>
          </section>

        </div>

        {/* Legal Notice */}
        <div className="mt-16 pt-8 border-t border-[#C5A04E]/10 text-xs text-gray-400 space-y-1">
          <p><strong className="text-gray-500">Company name:</strong> HAMZA SHOP</p>
          <p><strong className="text-gray-500">Registered office:</strong> 808 Boulevard La Grand Delle, 14200 Hérouville-Saint-Clair, France</p>
          <p><strong className="text-gray-500">RCS number:</strong> 842 966 145 R.C.S. Caen</p>
          <p><strong className="text-gray-500">Contact:</strong> lexmoacadmy@gmail.com</p>
          <p><strong className="text-gray-500">Platform:</strong> lexmo.ai</p>
          <p className="mt-4 text-gray-700">© 2026 ECOMY — HAMZA SHOP. All rights reserved.</p>
        </div>

      </div>
    </div>
  );
}
