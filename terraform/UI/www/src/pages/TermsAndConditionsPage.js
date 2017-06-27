import MarkdownPage from './MarkdownPage.js'

var markdown = `
# Terms and Conditions of Website Use

### **1.Introduction**

Welcome to DashVid.io.

This page tells you the terms on which you may use our website [DashVid.io](https://DashVid.io), whether as registered user or guest. Please read carefully before use.

By using the site, you accept the terms and agree to obey them. If you don&#39;t accept them, please don&#39;t use the site.

### **2.Who We Are**

[DashVid.io](https://DashVid.io) is operated by [Jassoft Ltd](https://Jassoft.co.uk), a UK Limited company registered in England under company number 07419231.

Some important details about us:

Our registered office is at: 51 Watleys End Road, Bristol, BS36 1PH

Our VAT number is: 174 7208 96

### **3.Use of the Site**

You have permission for temporary use of the site, but we can withdraw or change our service at any time without telling you and without being legally responsible to you.

You must treat all identification codes, passwords and other security information as confidential. If we think you have failed to keep confidentiality, we are allowed to disable any security information (including your passwords and codes).

You agree to follow our acceptable use policy [https://DashVid.io/acceptable-use-policy](https://DashVid.io/acceptable-use-policy).

If you allow anyone else to use our site, you must make sure that they read these terms first, and that they follow them.

Only use the site as allowed by law and these terms. If you don&#39;t, we may suspend your usage, or stop it completely.

We frequently update the site and make changes to it, but we don&#39;t have to do this, and material on the site may be out-of-date. No material on the site is intended to contain advice, and you shouldn&#39;t rely on it. We exclude all legal responsibility and costs for reliance placed on the site by anyone.

We follow our privacy policy in handling information about you. You can read our policy at [https://DashVid.io/privacy-policy](https://DashVid.io/privacy-policy).

By using the site, you agree to us handling this information and confirm that data you provide is accurate.

If you order goods or services from us through the site, your order will take place under our Terms and Conditions of Supply, which you can read at [Insert Link].

### **4.Intellectual Property Rights**

We are the owner or licensee of all intellectual property rights in the site (for example the copyright and any rights in the designs) and in any of the material posted on it. They are protected by copyright.

You are allowed to print one copy and download extracts of any page on the site for your personal reference, but not for commercial use without a licence from us. You must not alter anything, or use any illustrations, video, audio or photographs separately from the text that goes with them.

If you breach these terms, you lose your right to use our site, and must destroy or return any copies you have made.

### **5.Our Legal Responsibility to You**

We do not guarantee the accuracy of material on our site. As far as legally possible, we exclude legal responsibility for the following:

Any loss to you arising from use of our site

Loss of income, profit, business, data, contracts, goodwill or savings.

We also exclude, as far as legally possible, all terms and warranties or promises implied by law or by statutes.

We don&#39;t exclude legal responsibility for death or personal injury owing to our negligence, or legal responsibility for fraud or fraudulent misrepresentation, or for anything else where exclusion is not allowed by the law.

### **6.Uploading to our Site**

If you contact other users of our site or upload material to it, you must follow our acceptable use policy, which sets out standards for usage. You can read this policy at [https://DashVid.io/acceptable-use-policy](https://DashVid.io/acceptable-use-policy). You agree to reimburse us for any costs or expenses we incur as a result of any breach of this term.

Material that you upload will be regarded as non-confidential and not owned. This means that we can copy it, distribute it, and show it to other people for any purpose. You agree that if anyone else claims to own the material, or says that it breaches their rights, we can give them your identity.

We won&#39;t be legally responsible to anybody for the accuracy of material that you upload to the site, and we can remove it at any time if we think it doesn&#39;t follow our acceptable use policy.

### **7.Computer Offences**

If you do anything which is a criminal offence under a law called the Computer Misuse Act 1990, your right to use the site will end straightaway. We will report you to the relevant authorities and give them your identity.

Examples of computer misuse include introducing viruses, worms, Trojans and other technologically harmful or damaging material.

You mustn&#39;t try to get access to our site or server or any connected database or make any &#39;attack&#39; on the site. We won&#39;t be legally responsible to you for any damage from viruses or other harmful material that you pick up via our site.

### **8.Links to Our Site**

You are allowed to make a legal link to our website&#39;s homepage from your website if the content on your site meets the standards of our acceptable use policy. We can end this permission at any time.

You mustn&#39;t suggest any endorsement by us or association with us unless we agree in writing.

### **9.Links From Our Site**

Links from our site to other sites are only for information. We don&#39;t accept responsibility for other sites or any loss you suffer from using them.

### **10.Variation**

We change these terms from time to time and you must check them for changes because they are binding on you.

### **11.Applicable Law**

11.1 The Parties will use their best efforts to negotiate in good faith and settle any dispute that may arise out of or relate to this Agreement or any breach of it.

11.2 If any such dispute cannot be settled amicably through ordinary negotiations between the Parties, or either or both is or are unwilling to engage in this process, either Party may propose to the other in writing that structured negotiations be entered into with the assistance of a fully accredited mediator before resorting to litigation.

11.3 If the Parties are unable to agree upon a mediator, or if the mediator agreed upon is unable or unwilling to act and an alternative mediator cannot be agreed, any party may within 14 days of the date of knowledge of either event apply to LawBite to appoint a mediator under the LawBite Mediation Procedure.

11.4 Within 14 days of the appointment of the mediator (either by mutual agreement of the Parties or by LawBite in accordance with their mediation procedure), the Parties will meet with the mediator to agree the procedure to be adopted for the mediation, unless otherwise agreed between the parties and the mediator.

11.5 All negotiations connected with the relevant dispute(s) will be conducted in confidence and without prejudice to the rights of the Parties in any further proceedings.

11.6 If the Parties agree on a resolution of the dispute at mediation, the agreement shall be reduced to writing and, once signed by the duly authorised representatives of both Parties, shall be final and binding on them.

11.7 If the Parties fail to resolve the dispute(s) within 60 days (or such longer term as may be agreed between the Parties) of the mediator being appointed, or if either Party withdraws from the mediation procedure, then either Party may exercise any right to seek a remedy through arbitration by an arbitrator to be appointed by LawBite under the Rules of the LawBite Arbitration Scheme.

11.8 Any dispute shall not affect the Parties&#39; ongoing obligations under the Agreement.

11.9 The English courts have the only right to hear claims related to our site, and all disputes are governed by English law.

### **12.Contact Us**

Please email us at website@DashVid.io to contact us about any issues.
`;

export default class TermsAndConditionsPage extends MarkdownPage {

    constructor(props) {
        super(props, markdown);

    }
}