import { jsPDF } from "jspdf";
import fs from "fs";
const f = {
  composer_name: "Ana Reyes",
  composer_entity_type: "Individual",
  producer_name: "Silverline Pictures LLC",
  effective_date: "2026-08-14",
  project_title: "Last Bus North",
  project_type: "Feature Film",
  runtime: "98 minutes / 24 cues",
  services: "Compose, arrange, orchestrate, perform, record, mix, and deliver original score",
  deliverables: "Final stereo mixes, stems, and a completed music cue sheet",
  delivery_date: "2026-10-01",
  revisions: "2 rounds per cue",
  fee_type: "All-In / Package Deal",
  fee_amount: "$15,000",
  package_covers: "musicians, studio, software, and all recording costs",
  payment_schedule: "1/3 on execution, 1/3 on spotting, 1/3 on delivery.",
  royalties: "",
  ownership: "Work-Made-For-Hire (Producer owns)",
  publishing: "Producer controls publishing; composer retains writer's share",
  credit_text: "Original Music by Ana Reyes",
  pro_affiliation: "ASCAP",
};
const additionalTerms = "Producer shall provide locked picture prior to the spotting session.";
const DISCLAIMER =
  "TEMPLATE ONLY — NOT LEGAL ADVICE. A composer deal typically covers BOTH the composition/score copyright (usually work-made-for-hire) and delivery of the master recordings (stems and mixes). Consult a qualified entertainment attorney before executing this agreement.";
const fd = (x) => {
  if (!x) return "";
  const [y, m, d] = x.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
};
const v = (x, p) => (x.trim() ? x.trim() : `[${p}]`);
const s = (x, p) => v(x, p).replace(/[.;,]+$/, "");
const intro = `This Composer Agreement ("Agreement") is entered into as of ${v(fd(f.effective_date), "effective date")} by and between ${v(f.composer_name, "composer")} (${v(f.composer_entity_type, "entity type")}) ("Composer") and ${v(f.producer_name, "producer / company")} ("Producer").`;
const isPackage = f.fee_type === "All-In / Package Deal";
const clauses = [
  { heading: "Engagement & Services", body: `Producer hereby engages Composer to ${s(f.services, "scope of services")} for the motion picture or program presently entitled "${v(f.project_title, "project title")}" (the "Project"), a ${v(f.project_type, "project type")}${f.runtime.trim() ? ` of approximately ${f.runtime.trim()}` : ""}. Composer shall render such services in a timely, professional manner and in accordance with Producer's creative direction.` },
  { heading: "Delivery & Schedule", body: `Composer shall deliver the following: ${s(f.deliverables, "deliverables")}. Delivery shall be completed no later than ${v(fd(f.delivery_date), "score delivery deadline")}. ${s(f.revisions, "included revisions")} of revisions are included within the compensation stated below, at no additional cost to Producer.` },
  { heading: "Compensation", body: `Composer shall be compensated on a ${v(f.fee_type, "fee type")} basis in the amount of ${v(f.fee_amount, "fee (USD)")}.${isPackage ? ` This is an all-in package fee inclusive of ${s(f.package_covers, "what the package covers")}, and Composer shall be solely responsible for such costs.` : ""} Payment schedule: ${s(f.payment_schedule, "payment schedule")}.` },
  { heading: "Royalties / Backend", body: "No additional royalties, participations, or backend are payable beyond the fee stated above, except that Composer shall retain the writer's share of public-performance royalties collected through Composer's performing rights organization." },
  { heading: "Ownership of Score", body: `All results and proceeds of Composer's services hereunder, including the score, all cues, arrangements, and master recordings, are created as works made for hire specially ordered and commissioned by Producer, and Producer shall be deemed the author and sole owner thereof throughout the universe in perpetuity, in all media now known or hereafter devised. To the extent any such material does not qualify as a work made for hire, Composer hereby irrevocably assigns to Producer all right, title, and interest therein, including all copyrights and renewals thereof.` },
  { heading: "Publishing", body: `${s(f.publishing, "publishing")}.${f.pro_affiliation.trim() ? ` Composer's performing rights organization affiliation is ${f.pro_affiliation.trim()}, and the parties shall promptly register the score and file a cue sheet accordingly.` : ""}` },
  { heading: "Credit", body: `Subject to Composer's full performance hereunder, Producer shall accord Composer credit substantially as follows: ${s(f.credit_text, "credit")}. Casual or inadvertent failure to comply shall not constitute a breach of this Agreement.` },
  { heading: "Representations & Warranties", body: `Composer represents and warrants that the score is and shall be original to Composer, that it does not and will not infringe upon the copyright or any other right of any third party, and that any samples, loops, libraries, or other third-party elements incorporated therein shall be fully licensed and cleared at Composer's expense prior to delivery.` },
  { heading: "Additional Terms", body: v(additionalTerms, "additional terms") },
];
const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "letter" });
const pw = doc.internal.pageSize.getWidth();
const ph = doc.internal.pageSize.getHeight();
const margin = 22;
const cw = pw - margin * 2;
let y = margin;
const ensure = (h = 8) => {
  if (y + h > ph - margin) {
    doc.addPage();
    y = margin;
  }
};
const write = (t, size = 11, style = "normal", align = "left") => {
  doc.setFontSize(size);
  doc.setFont("times", style);
  doc.splitTextToSize(t, cw).forEach((l) => {
    ensure(6);
    if (align === "center") doc.text(l, pw / 2, y, { align: "center" });
    else doc.text(l, margin, y);
    y += size * 0.55;
  });
};
write("COMPOSER AGREEMENT", 15, "bold", "center");
y += 6;
write(intro);
y += 4;
clauses.forEach((c, i) => {
  ensure(14);
  write(`${i + 1}. ${c.heading.toUpperCase()}`, 11, "bold");
  y += 1;
  write(c.body);
  y += 4;
});
y += 4;
write("IN WITNESS WHEREOF, the parties have executed this Agreement as of the Effective Date.");
y += 10;
ensure(40);
write("COMPOSER", 11, "bold");
y += 2;
write("Signature: ______________________________");
write(`Printed Name: ${v(f.composer_name, "composer")}`);
write("Date: __________________________________");
y += 8;
ensure(30);
write("PRODUCER", 11, "bold");
y += 2;
write("Signature: ______________________________");
write(`Printed Name: ${v(f.producer_name, "producer / company")}`);
write("Date: __________________________________");
y += 12;
ensure(16);
doc.setTextColor(120, 120, 120);
write(DISCLAIMER, 8, "italic");
write("Filmmaker Genius — Document Library.", 8, "italic");
fs.writeFileSync("/tmp/qa2/comp.pdf", Buffer.from(doc.output("arraybuffer")));
console.log("ok");
