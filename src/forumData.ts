export type Category = 'Q&A' | 'Ideas' | 'Announcements' | 'General';

export interface Comment {
  id: string;
  author: string;
  authorAvatar: string;
  content: string; // Markdown
  createdAt: string;
  isAnswer?: boolean;
}

export interface Discussion {
  id: string;
  title: string;
  category: Category;
  author: string;
  authorAvatar: string;
  tags: string[];
  upvotes: number;
  createdAt: string;
  content: string; // Markdown
  comments: Comment[];
  isAnswered: boolean;
}

export const CATEGORIES: { name: Category; desc: string; icon: string; color: string }[] = [
  { name: 'Q&A', desc: 'Ask the community for help', icon: '❓', color: '#10b981' },
  { name: 'Ideas', desc: 'Share ideas for new features', icon: '💡', color: '#3b82f6' },
  { name: 'Announcements', desc: 'Project news and updates', icon: '📢', color: '#8b5cf6' },
  { name: 'General', desc: 'Chat about anything else', icon: '💬', color: '#64748b' },
];

export const MOCK_DISCUSSIONS: Discussion[] = [
  {
    id: 'd1',
    title: 'Sarek pipeline failing at BaseRecalibrator step',
    category: 'Q&A',
    author: 'bioinfo_guru',
    authorAvatar: 'BG',
    tags: ['sarek', 'gatk', 'error'],
    upvotes: 5,
    createdAt: '2 hours ago',
    isAnswered: true,
    content: `I'm trying to run the nf-core/sarek pipeline on a cohort of 50 WES samples, but it keeps crashing during the \`BaseRecalibrator\` process. 

The error log says something about the known sites VCF:
\`\`\`bash
A USER ERROR has occurred: Bad input: The provided VCF file is malformed.
\`\`\`

I'm using the standard dbSNP v154 VCF from the GATK resource bundle. Has anyone seen this before? Do I need to index it differently?`,
    comments: [
      {
        id: 'c1',
        author: 'genomics_ninja',
        authorAvatar: 'GN',
        content: `Yes! I ran into this last week. The issue is usually that the contig names in your reference FASTA don't exactly match the contig names in the dbSNP VCF (e.g., \`chr1\` vs \`1\`). 

Check your FASTA headers. If they don't match, you might need to use a different resource bundle or rename the contigs in your VCF using \`bcftools annotate\`.`,
        createdAt: '1 hour ago',
        isAnswer: true
      },
      {
        id: 'c2',
        author: 'bioinfo_guru',
        authorAvatar: 'BG',
        content: `Ah, that was exactly it. My FASTA didn't have the \`chr\` prefix. Switching to the correct reference bundle fixed it. Thanks!`,
        createdAt: '45 mins ago'
      }
    ]
  },
  {
    id: 'd2',
    title: 'Should we add support for structural variants (SVs) in the Map?',
    category: 'Ideas',
    author: 'niccolo_v',
    authorAvatar: 'NV',
    tags: ['feature-request', 'sv', 'map'],
    upvotes: 12,
    createdAt: '1 day ago',
    isAnswered: false,
    content: `Currently, our interactive map primarily focuses on SNVs, Indels, and CNVs. It would be amazing to add dedicated pipelines for Structural Variant (SV) calling, like Manta, Delly, or Lumpy. 

What does the community think? Are there specific SV callers you'd like to see prioritized?`,
    comments: [
      {
        id: 'c3',
        author: 'cancer_researcher',
        authorAvatar: 'CR',
        content: `+1 for Manta! It pairs really well with Strelka2 for somatic calling.`,
        createdAt: '20 hours ago'
      }
    ]
  },
  {
    id: 'd3',
    title: 'Welcome to the MutaMetro Discussions!',
    category: 'Announcements',
    author: 'admin',
    authorAvatar: 'AD',
    tags: ['welcome'],
    upvotes: 24,
    createdAt: '3 days ago',
    isAnswered: false,
    content: `Welcome to the new MutaMetro community forum! 

This space is designed to operate similarly to GitHub Discussions. You can ask questions about specific pipelines, propose new ideas, and help others troubleshoot their workflows.

**Guidelines:**
- Be respectful and helpful.
- If asking a question, provide as much context as possible (error logs, pipeline version, sample type).
- Use tags to categorize your posts.

Happy bioinformatics!`,
    comments: []
  }
];
