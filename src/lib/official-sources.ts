export type OfficialSource = {
  id: string;
  label: string;
  family: "PIB" | "PMO" | "PRESIDENT";
  url: string;
  category: string;
  ministry?: string;
};

export const officialSources: OfficialSource[] = [
  {
    id: "pib-all",
    label: "PIB All Releases",
    family: "PIB",
    url: "https://www.pib.gov.in/allreleasem.aspx?lang=1&reg=3",
    category: "Mixed",
  },
];

export const ministryBuckets = [
  "Prime Minister's Office",
  "President Secretariat",
  "Ministry of Finance",
  "Ministry of Home Affairs",
  "Ministry of Education",
  "Ministry of Rural Development",
  "Ministry of Science & Technology",
  "Ministry of Environment, Forest and Climate Change",
];
