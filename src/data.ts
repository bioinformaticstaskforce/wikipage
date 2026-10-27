export interface FileInfo {
  name: string;       // e.g. "sample_R1.fq.gz"
  format: string;     // e.g. "FASTQ"
  description: string; // e.g. "Raw paired-end reads"
}

export interface Step {
  id: string;
  label: string;
}

export interface Tool {
  id: string;
  name: string;
  hint: string;
  simple: string;
  technical: string;
  pros: string[];
  cons: string[];
  links: { label: string; url: string }[];
  criteria?: string;
  params?: string; // Recommended CLI invocation or key flags
  inputFiles?: FileInfo[];
  outputFiles?: FileInfo[];
}

export interface Station {
  id: string;
  stepId: string;
  toolId: string;
  type?: "hub" | "branch" | "file";
}

export type PipelineStatus = "stable" | "review" | "experimental";
export type PipelineScope = "clinical" | "exploratory";
export type OmicsCategory = "DNA" | "RNA" | "Methylation" | "Proteomics" | "Fragmentomics";

export interface ClinicalProfile {
  specimen: string;        // e.g. "FFPE, fresh-frozen, cfDNA"
  minDNA: string;          // e.g. "≥ 50 ng"
  coverage: string;        // e.g. "≥ 100× target"
  lod: string;             // Limit of Detection, e.g. "5% VAF"
  reportableRange: string; // e.g. "SNVs, small indels (≤50 bp)"
  tat: string;             // Turnaround time, e.g. "6-8h on 32-core node"
  accreditation?: string;  // e.g. "Aligned with ISO 15189"
}

export interface WikiContent {
  theory: string;
  publications: { title: string; authors: string; journal: string; doi: string; url: string }[];
  examples: { title: string; desc: string; url?: string }[];
}

export type VariantType = "SNV" | "Indel" | "CNV" | "SV" | "RNA Fusion";

export interface Line {
  id: string;
  name: string;
  shortName: string;
  color: string;
  highlighted?: boolean;
  stops: string[];
  status: PipelineStatus;
  scope: PipelineScope;
  omicsCategory: OmicsCategory;
  technology?: string;        // e.g. "Illumina", "Nanopore", "Any"
  clinical?: ClinicalProfile;
  wiki?: WikiContent;
  supportedVariants: VariantType[];
}

export interface GlossaryEntry {
  term: string;
  definition: string;
}

export const GLOSSARY: GlossaryEntry[] = [
  { term: "VAF", definition: "Variant Allele Frequency — the proportion of sequencing reads supporting the variant allele." },
  { term: "BQSR", definition: "Base Quality Score Recalibration — a GATK process that corrects systematic biases in base quality scores assigned by the sequencer." },
  { term: "Panel of Normals", definition: "A collection of normal samples processed through the same pipeline, used to filter recurrent technical artifacts in somatic calling." },
  { term: "LOD", definition: "Limit of Detection — the minimum variant allele frequency that the pipeline can reliably detect." },
  { term: "FFPE", definition: "Formalin-Fixed Paraffin-Embedded — a common tissue preservation method that introduces DNA artifacts requiring specific handling." },
  { term: "cfDNA", definition: "Cell-free DNA — fragmented DNA circulating in the bloodstream, used in liquid biopsy applications." },
  { term: "WGS", definition: "Whole Genome Sequencing — sequencing of the entire genome, typically at 30-60× coverage." },
  { term: "WES", definition: "Whole Exome Sequencing — targeted sequencing of protein-coding regions (~1-2% of the genome)." },
  { term: "UMI", definition: "Unique Molecular Identifiers — short random sequences added during library prep to enable error correction and true duplicate removal." },
  { term: "TAT", definition: "Turnaround Time — the time from sample receipt to report delivery." },
];

export const SITE_NAME = "MetrOmics";
export const SITE_TAGLINE = "Consolidated pipeline recommendations for multi-omic analysis";

/* ── Omics Categories Configuration ────────────────── */
export interface OmicsCategoryConfig {
  id: OmicsCategory;
  label: string;
  icon: string;
  description: string;
  available: boolean;
}

export const OMICS_CATEGORIES: OmicsCategoryConfig[] = [
  { id: "DNA", label: "DNA", icon: "🧬", description: "Somatic & germline variant calling, CNV, SV analysis", available: true },
  { id: "RNA", label: "RNA", icon: "📝", description: "Transcriptomics, differential expression, fusion detection", available: false },
  { id: "Methylation", label: "Methylation", icon: "🔬", description: "Bisulfite sequencing, methylation profiling, DMR analysis", available: false },
  { id: "Proteomics", label: "Proteomics", icon: "🔷", description: "Mass spectrometry-based protein identification & quantification", available: false },
  { id: "Fragmentomics", label: "Fragmentomics", icon: "🧩", description: "cfDNA fragment size analysis, nucleosome positioning", available: false },
];

export const STEPS: Step[] = [
  { id: "input", label: "Input" },
  { id: "qc", label: "QC & Trim" },
  { id: "align", label: "Alignment" },
  { id: "postproc", label: "Post-process" },
  { id: "calling", label: "Variant Calling" },
  { id: "filtering", label: "Filtering" },
  { id: "annotation", label: "Annotation" },
  { id: "reporting", label: "Reporting" },
];

export const TOOLS: Record<string, Omit<Tool, 'id'>> = {
  fastqc: {
    name: "FastQC",
    hint: "Checks raw read quality before anything else.",
    simple: "Scans your raw sequencing reads and flags quality problems (adapter contamination, low-quality bases) before you spend compute on alignment.",
    technical: "Run per-sample on raw FASTQs; aggregate with MultiQC. No parameters typically need tuning for a first pass.",
    pros: ["Fast, zero-config", "Universally understood reports", "De facto standard"],
    cons: ["Doesn't fix anything — just reports", "Some warnings are noisy on amplicon/panel data"],
    criteria: "Every pipeline should include a QC step. FastQC is the minimum viable quality gate before alignment.",
    params: "fastqc --threads 4 -o qc_output/ sample_R1.fq.gz sample_R2.fq.gz",
    links: [{ label: "FastQC docs", url: "https://www.bioinformatics.babraham.ac.uk/projects/fastqc/" }],
    inputFiles: [
      { name: "sample_R1.fq.gz", format: "FASTQ", description: "Raw paired-end reads (forward)" },
      { name: "sample_R2.fq.gz", format: "FASTQ", description: "Raw paired-end reads (reverse)" },
    ],
    outputFiles: [
      { name: "sample_R1_fastqc.html", format: "HTML", description: "Interactive quality report" },
      { name: "sample_R1_fastqc.zip", format: "ZIP", description: "Raw QC data for MultiQC aggregation" },
    ],
  },
  fastp: {
    name: "fastp",
    hint: "All-in-one QC and adapter trimming — faster than doing it in two steps.",
    simple: "Combines quality checking and read trimming in a single fast tool. Particularly suited for modern Illumina data.",
    technical: "Single binary, multithreaded; handles adapter trimming, quality filtering, polyG/X trimming for NovaSeq-style data.",
    pros: ["Single step instead of two", "Very fast (C++)", "Good defaults for modern Illumina chemistry"],
    cons: ["Less granular control than FastQC+Trimmomatic", "Report format differs from FastQC"],
    criteria: "Recommended when trimming is required. For NovaSeq data, enable polyG trimming.",
    params: "fastp -i R1.fq.gz -I R2.fq.gz -o R1.trimmed.fq.gz -O R2.trimmed.fq.gz --detect_adapter_for_pe --trim_poly_g -w 8",
    links: [{ label: "fastp GitHub", url: "https://github.com/OpenGene/fastp" }],
    inputFiles: [
      { name: "R1.fq.gz", format: "FASTQ", description: "Raw paired-end reads (forward)" },
      { name: "R2.fq.gz", format: "FASTQ", description: "Raw paired-end reads (reverse)" },
    ],
    outputFiles: [
      { name: "R1.trimmed.fq.gz", format: "FASTQ", description: "Trimmed reads (forward)" },
      { name: "R2.trimmed.fq.gz", format: "FASTQ", description: "Trimmed reads (reverse)" },
      { name: "fastp.html", format: "HTML", description: "QC + trimming report" },
      { name: "fastp.json", format: "JSON", description: "Machine-readable QC metrics" },
    ],
  },
  adapterremoval: {
    name: "AdapterRemoval",
    hint: "Trims adapters and merges overlapping paired reads — key for ancient DNA.",
    simple: "Strips sequencing adapters and, for ancient/short DNA fragments, merges overlapping read pairs into a single consensus read.",
    technical: "Supports collapse of PE reads, quality-trimming, and minimum-length filtering. Critical for aDNA fragmentation patterns.",
    pros: ["Excellent for ancient/degraded DNA", "Read collapsing improves alignment accuracy"],
    cons: ["Less commonly used in modern clinical pipelines"],
    links: [{ label: "AdapterRemoval GitHub", url: "https://github.com/MikkelSchubert/adapterremoval" }],
    inputFiles: [
      { name: "R1.fq.gz", format: "FASTQ", description: "Raw paired-end reads (forward)" },
      { name: "R2.fq.gz", format: "FASTQ", description: "Raw paired-end reads (reverse)" },
    ],
    outputFiles: [
      { name: "output.collapsed.fq.gz", format: "FASTQ", description: "Merged overlapping reads (consensus)" },
      { name: "output.pair1.fq.gz", format: "FASTQ", description: "Non-overlapping trimmed (forward)" },
      { name: "output.pair2.fq.gz", format: "FASTQ", description: "Non-overlapping trimmed (reverse)" },
    ],
  },
  bwamem2: {
    name: "BWA-MEM2",
    hint: "The standard short-read aligner most pipelines default to.",
    simple: "Maps your sequencing reads onto the reference genome. Workhorse aligner used by most clinical and research pipelines worldwide.",
    technical: "bwa-mem2 mem -t <threads> ref.fa R1.fq R2.fq | samtools sort. ~2-3x faster than classic BWA-MEM with identical results.",
    pros: ["Extremely well validated", "Compatible with all downstream GATK tools", "Faster than original BWA-MEM"],
    cons: ["Higher memory footprint (~32 GB for human genome)", "Not optimized for very long reads"],
    criteria: "Standard for Illumina short-read alignment. Use BWA-MEM2 over BWA-MEM for speed unless memory-constrained.",
    params: "bwa-mem2 mem -t 16 -K 100000000 -Y -R '@RG\\\\tID:sample\\\\tSM:sample\\\\tPL:ILLUMINA' ref.fa R1.fq R2.fq | samtools sort -@ 4 -o sorted.bam",
    links: [{ label: "BWA-MEM2 GitHub", url: "https://github.com/bwa-mem2/bwa-mem2" }],
    inputFiles: [
      { name: "R1.trimmed.fq.gz", format: "FASTQ", description: "Trimmed reads (forward)" },
      { name: "R2.trimmed.fq.gz", format: "FASTQ", description: "Trimmed reads (reverse)" },
      { name: "ref.fa", format: "FASTA", description: "Reference genome (GRCh38)" },
    ],
    outputFiles: [
      { name: "sorted.bam", format: "BAM", description: "Coordinate-sorted aligned reads" },
      { name: "sorted.bam.bai", format: "BAI", description: "BAM index file" },
    ],
  },
  dragmap: {
    name: "DRAGMAP",
    hint: "Illumina's open-source aligner, designed to match DRAGEN hardware results.",
    simple: "An alternative to BWA-MEM2 built by Illumina, designed so results match their DRAGEN hardware-accelerated pipeline.",
    technical: "Requires a DRAGMAP-specific reference hash table before alignment (different from a BWA index).",
    pros: ["Designed for concordance with DRAGEN pipelines", "Open source"],
    cons: ["Smaller community", "Separate reference indexing step"],
    links: [{ label: "DRAGMAP GitHub", url: "https://github.com/Illumina/DRAGMAP" }],
    inputFiles: [
      { name: "R1.trimmed.fq.gz", format: "FASTQ", description: "Trimmed reads (forward)" },
      { name: "R2.trimmed.fq.gz", format: "FASTQ", description: "Trimmed reads (reverse)" },
      { name: "hash_table/", format: "Directory", description: "DRAGMAP reference hash table" },
    ],
    outputFiles: [
      { name: "sorted.bam", format: "BAM", description: "Coordinate-sorted aligned reads" },
    ],
  },
  gatk_markduplicates: {
    name: "MarkDuplicates",
    hint: "Flags PCR/optical duplicate reads so they don't inflate variant confidence.",
    simple: "Identifies reads that are duplicates of each other (PCR or optical artifacts) and flags them so they don't get counted twice when calling variants.",
    technical: "Part of GATK/Picard; operates on coordinate-sorted BAM/CRAM. Standard pre-BQSR step in all GATK pipelines.",
    pros: ["Battle-tested, GATK standard", "Detailed duplicate metrics output"],
    cons: ["Single-threaded by default, can be slow", "Sentieon's equivalent is faster with a license"],
    criteria: "Mandatory for WGS/WES. For amplicon panels, use UMI-based deduplication instead.",
    params: "gatk MarkDuplicates -I sorted.bam -O dedup.bam -M dedup_metrics.txt --OPTICAL_DUPLICATE_PIXEL_DISTANCE 2500",
    links: [{ label: "GATK MarkDuplicates", url: "https://gatk.broadinstitute.org/hc/en-us/articles/360037052812" }],
    inputFiles: [
      { name: "sorted.bam", format: "BAM", description: "Coordinate-sorted aligned reads" },
    ],
    outputFiles: [
      { name: "dedup.bam", format: "BAM", description: "Deduplicated BAM (duplicates flagged)" },
      { name: "dedup.bam.bai", format: "BAI", description: "BAM index" },
      { name: "dedup_metrics.txt", format: "TXT", description: "Duplication rate statistics" },
    ],
  },
  gatk_bqsr: {
    name: "GATK BQSR",
    hint: "Corrects systematic sequencer errors in base quality scores.",
    simple: "Sequencers are systematically biased in reporting confidence. BQSR learns and corrects that bias using known-variant sites.",
    technical: "Two-step: BaseRecalibrator builds a recalibration table against known-sites VCFs (dbSNP, Mills); ApplyBQSR rewrites quality scores.",
    pros: ["Improves variant calling precision", "Standard in GATK Best Practices"],
    cons: ["Adds runtime", "Benefit is smaller for high-quality modern chemistry"],
    criteria: "Recommended for clinical-grade calls. May be skipped for exploratory or large-cohort research where marginal gains don't justify compute.",
    params: "gatk BaseRecalibrator -R ref.fa -I dedup.bam --known-sites dbsnp.vcf --known-sites mills.vcf -O recal.table && gatk ApplyBQSR -R ref.fa -I dedup.bam --bqsr-recal-file recal.table -O recal.bam",
    links: [{ label: "GATK BQSR docs", url: "https://gatk.broadinstitute.org/hc/en-us/articles/360035890531" }],
    inputFiles: [
      { name: "dedup.bam", format: "BAM", description: "Deduplicated aligned reads" },
      { name: "ref.fa", format: "FASTA", description: "Reference genome" },
      { name: "dbsnp.vcf", format: "VCF", description: "Known variant sites (dbSNP)" },
      { name: "mills.vcf", format: "VCF", description: "Known indel sites (Mills)" },
    ],
    outputFiles: [
      { name: "recal.table", format: "TABLE", description: "Recalibration model" },
      { name: "recal.bam", format: "BAM", description: "Base quality-recalibrated reads" },
    ],
  },
  mutect2: {
    name: "Mutect2",
    hint: "The standard somatic (tumor) variant caller from the Broad Institute.",
    simple: "Calls short mutations (SNPs and Indels) in tumor samples, typically paired with a matched normal sample to filter germline variants.",
    technical: "Uses local de novo assembly of haplotypes. GATK's primary somatic caller. Supports tumor-only mode for cases without matched normal.",
    pros: ["Highly accurate for somatic SNVs/indels", "Active development by Broad Institute", "Supports panel of normals"],
    cons: ["Can be slow on high-coverage data", "Requires paired normal for best results"],
    criteria: "Recommended for solid tumor somatic variant calling when coverage ≥ 50×. For liquid biopsy or ultra-low tumor fraction, consider specialized tools.",
    params: "gatk Mutect2 -R ref.fa -I tumor.bam -I normal.bam -normal normal_sample --germline-resource af-only-gnomad.vcf --panel-of-normals pon.vcf -O somatic.vcf.gz --f1r2-tar-gz f1r2.tar.gz",
    links: [{ label: "GATK Mutect2", url: "https://gatk.broadinstitute.org/hc/en-us/articles/360037593851-Mutect2" }],
    inputFiles: [
      { name: "tumor.bam", format: "BAM", description: "Tumor sample (recalibrated)" },
      { name: "normal.bam", format: "BAM", description: "Matched normal sample (optional)" },
      { name: "ref.fa", format: "FASTA", description: "Reference genome" },
      { name: "af-only-gnomad.vcf", format: "VCF", description: "Germline resource (gnomAD)" },
      { name: "pon.vcf", format: "VCF", description: "Panel of Normals" },
    ],
    outputFiles: [
      { name: "somatic.vcf.gz", format: "VCF", description: "Raw somatic variant calls" },
      { name: "f1r2.tar.gz", format: "TAR.GZ", description: "Orientation bias artifact data" },
      { name: "somatic.vcf.gz.stats", format: "TXT", description: "Mutect2 calling statistics" },
    ],
  },
  strelka2: {
    name: "Strelka2",
    hint: "Extremely fast and accurate somatic and germline variant caller by Illumina.",
    simple: "An alternative variant caller that is dramatically faster than Mutect2 while maintaining high accuracy, especially for indels.",
    technical: "Uses a mixture model-based approach. Runs both germline and somatic calling. Usually paired with Manta for structural variant detection.",
    pros: ["Very fast (10-100× faster than Mutect2)", "High accuracy for indels", "Low memory footprint"],
    cons: ["Slightly different filtering model than GATK", "Less active development (archived)"],
    criteria: "Can be run in parallel with Mutect2 to create an intersection consensus for high-confidence clinical reporting.",
    links: [{ label: "Strelka2 GitHub", url: "https://github.com/Illumina/strelka" }],
    inputFiles: [
      { name: "tumor.bam", format: "BAM", description: "Tumor sample (deduplicated)" },
      { name: "normal.bam", format: "BAM", description: "Matched normal sample" },
      { name: "ref.fa", format: "FASTA", description: "Reference genome" },
    ],
    outputFiles: [
      { name: "somatic.snvs.vcf.gz", format: "VCF", description: "Somatic SNV calls" },
      { name: "somatic.indels.vcf.gz", format: "VCF", description: "Somatic indel calls" },
    ],
  },
  gatk_filtermutectcalls: {
    name: "FilterMutectCalls",
    hint: "Filters raw Mutect2 calls to remove false positives.",
    simple: "Applies statistical filters to the raw variant list from Mutect2, removing likely artifacts and false positives to produce a high-confidence callset.",
    technical: "Uses orientation bias artifacts, contamination estimates, and other statistics from Mutect2's internal model. Requires the f1r2 artifact model.",
    pros: ["Tuned specifically for Mutect2 output", "Handles sequencing artifacts well"],
    cons: ["Only works with Mutect2 output"],
    criteria: "Always run after Mutect2. Review filtering stats to check for high artifact rates that may indicate library prep issues.",
    params: "gatk FilterMutectCalls -R ref.fa -V somatic.vcf.gz --ob-priors artifact-priors.tar.gz --contamination-table contamination.table -O filtered.vcf.gz",
    links: [{ label: "GATK FilterMutectCalls", url: "https://gatk.broadinstitute.org/hc/en-us/articles/360036856831-FilterMutectCalls" }],
    inputFiles: [
      { name: "somatic.vcf.gz", format: "VCF", description: "Raw Mutect2 calls" },
      { name: "artifact-priors.tar.gz", format: "TAR.GZ", description: "Orientation bias model" },
      { name: "contamination.table", format: "TABLE", description: "Sample contamination estimate" },
    ],
    outputFiles: [
      { name: "filtered.vcf.gz", format: "VCF", description: "High-confidence somatic variants" },
      { name: "filtered.vcf.gz.filteringStats.tsv", format: "TSV", description: "Filter statistics summary" },
    ],
  },
  vep: {
    name: "Ensembl VEP",
    hint: "Predicts the functional effect of variants.",
    simple: "Determines if a mutation changes a protein, disrupts a regulatory region, or has known clinical significance. Cross-references ClinVar, COSMIC, and other databases.",
    technical: "Variant Effect Predictor. Annotates VCFs with consequence predictions, gene/transcript context, and clinical database cross-references.",
    pros: ["Comprehensive annotations", "Highly customizable with plugins", "Supports ClinVar, COSMIC, gnomAD"],
    cons: ["Requires large cache downloads (>15 GB) for local use"],
    criteria: "Standard for variant annotation. Ensure cache version exactly matches reference genome build (GRCh37 vs GRCh38).",
    params: "vep --input_file filtered.vcf.gz --output_file annotated.vcf --cache --offline --assembly GRCh38 --format vcf --vcf --everything --fork 4 --plugin ClinVar --plugin COSMIC",
    links: [{ label: "Ensembl VEP", url: "https://www.ensembl.org/info/docs/tools/vep/index.html" }],
    inputFiles: [
      { name: "filtered.vcf.gz", format: "VCF", description: "Filtered variant calls" },
      { name: "homo_sapiens_vep_cache/", format: "Directory", description: "VEP annotation cache (~15 GB)" },
    ],
    outputFiles: [
      { name: "annotated.vcf", format: "VCF", description: "Variants with functional annotations" },
      { name: "annotated.vcf_summary.html", format: "HTML", description: "Annotation summary report" },
    ],
  },
  multiqc: {
    name: "MultiQC",
    hint: "Aggregates logs from all tools into a single report.",
    simple: "Takes the output reports from every tool in the pipeline (FastQC, aligners, callers) and compiles them into one interactive HTML dashboard.",
    technical: "Parses standard output formats and generates a single HTML report with interactive plots. Supports 100+ bioinformatics tools.",
    pros: ["Saves time reviewing individual reports", "Beautiful interactive HTML output", "Supports nearly all bioinformatics tools"],
    cons: ["Requires all tools to produce parseable logs"],
    links: [{ label: "MultiQC", url: "https://multiqc.info/" }],
    inputFiles: [
      { name: "qc_output/", format: "Directory", description: "FastQC/fastp reports" },
      { name: "dedup_metrics.txt", format: "TXT", description: "MarkDuplicates metrics" },
      { name: "*.stats", format: "Various", description: "Tool logs and statistics" },
    ],
    outputFiles: [
      { name: "multiqc_report.html", format: "HTML", description: "Aggregated interactive QC dashboard" },
      { name: "multiqc_data/", format: "Directory", description: "Parsed metrics data (JSON/TSV)" },
    ],
  }
};

export const STATIONS: Station[] = [
  { id: "s_fastqc", stepId: "qc", toolId: "fastqc", type: "hub" },
  { id: "s_fastp", stepId: "qc", toolId: "fastp", type: "branch" },
  { id: "s_adapterremoval", stepId: "qc", toolId: "adapterremoval", type: "branch" },
  { id: "s_bwamem2", stepId: "align", toolId: "bwamem2", type: "hub" },
  { id: "s_dragmap", stepId: "align", toolId: "dragmap", type: "branch" },
  { id: "s_markdup", stepId: "postproc", toolId: "gatk_markduplicates", type: "hub" },
  { id: "s_bqsr", stepId: "postproc", toolId: "gatk_bqsr", type: "branch" },
  { id: "s_mutect2", stepId: "calling", toolId: "mutect2", type: "hub" },
  { id: "s_strelka2", stepId: "calling", toolId: "strelka2", type: "branch" },
  { id: "s_filter", stepId: "filtering", toolId: "gatk_filtermutectcalls", type: "hub" },
  { id: "s_vep", stepId: "annotation", toolId: "vep", type: "hub" },
  { id: "s_multiqc", stepId: "reporting", toolId: "multiqc", type: "hub" },
];

export const LINES: Line[] = [
  {
    id: "l_sarek",
    name: "NF-Core Sarek (v3.8.1)",
    shortName: "Sarek",
    color: "var(--line-sarek)",
    status: "stable",
    scope: "clinical",
    omicsCategory: "DNA",
    technology: "Illumina",
    stops: ["s_fastqc", "s_fastp", "s_bwamem2", "s_markdup", "s_bqsr", "s_mutect2", "s_filter", "s_vep", "s_multiqc"],
    clinical: {
      specimen: "Fresh-frozen tissue, FFPE (with artifact filtering)",
      minDNA: "≥ 50 ng (200 ng recommended for WGS)",
      coverage: "≥ 60× tumor, ≥ 30× normal (WGS)",
      lod: "~5% VAF at 60× coverage",
      reportableRange: "SNVs, small indels (≤ 50 bp)",
      tat: "6–10 h per sample pair on 32-core node",
      accreditation: "Widely used in ISO 15189-compliant labs",
    },
    supportedVariants: ["SNV", "Indel", "CNV", "SV"],
    wiki: {
      theory: `
Sarek is a comprehensive Nextflow-based workflow for somatic and germline variant calling. It implements **GATK Best Practices** but offers extreme modularity.

### Core Architecture
1.  **Alignment**: Supports swapping aligners (e.g., \`BWA-MEM2\` vs \`DRAGMAP\`).
2.  **Variant Calling**: Integrates multiple callers natively:
    *   **SNVs/Indels**: Mutect2, Strelka2, FreeBayes
    *   **SVs**: Manta, Tiddit
    *   **CNVs**: Control-FREEC, ASCAT

Its use of \`nf-core\` standards guarantees absolute reproducibility across compute environments (Docker, Singularity, Conda, AWS, GCP).
      `,
      publications: [
        { title: "Scalable and efficient DNA sequencing analysis on different compute infrastructures aiding variant discovery", authors: "Hanssen et al.", journal: "NAR Genomics and Bioinformatics", doi: "10.1093/nargab/lqae031", url: "https://doi.org/10.1093/nargab/lqae031" },
        { title: "Sarek: A portable workflow for whole-genome sequencing analysis of germline and somatic variants", authors: "Garcia et al.", journal: "F1000Research", doi: "10.12688/f1000research.16665.2", url: "https://doi.org/10.12688/f1000research.16665.2" }
      ],
      examples: [
        { title: "Running Sarek on AWS Batch", desc: "An architectural guide to deploying the Sarek pipeline efficiently on cloud infrastructure using nf-core/sarek." }
      ]
    }
  },
  {
    id: "l_gatk",
    name: "GATK Best Practices",
    shortName: "GATK BP",
    color: "var(--line-gatk)",
    status: "stable",
    scope: "clinical",
    omicsCategory: "DNA",
    technology: "Illumina",
    stops: ["s_fastqc", "s_bwamem2", "s_markdup", "s_bqsr", "s_mutect2", "s_filter"],
    clinical: {
      specimen: "Fresh-frozen tissue, FFPE, blood (germline)",
      minDNA: "≥ 100 ng for WES, ≥ 1 µg for WGS",
      coverage: "≥ 100× target (WES), ≥ 30× (WGS)",
      lod: "~5–10% VAF depending on coverage and caller mode",
      reportableRange: "SNVs, small indels, germline & somatic",
      tat: "4–8 h per sample (WES) on 16-core node",
      accreditation: "Broad Institute reference — basis for most clinical validations",
    },
    supportedVariants: ["SNV", "Indel", "CNV"],
    wiki: {
      theory: `
The GATK Best Practices constitute the _de facto_ standard for variant discovery. 

### Core Philosophy
The pipeline is divided into two major phases:
1.  **Data Pre-processing**: Ensuring the highest possible base quality through \`MarkDuplicates\` and \`BaseRecalibrator\` (BQSR).
2.  **Variant Discovery**: Utilizing highly sensitive local *de novo* assembly via \`HaplotypeCaller\` (germline) or \`Mutect2\` (somatic).

### Quality Control
The final step, **Variant Quality Score Recalibration (VQSR)** or \`FilterMutectCalls\`, uses advanced machine learning models (Gaussian Mixture Models) to distinguish true biological variation from technical sequencing artifacts.
      `,
      publications: [
        { title: "The Genome Analysis Toolkit: a MapReduce framework for analyzing next-generation DNA sequencing data", authors: "McKenna et al.", journal: "Genome Research", doi: "10.1101/gr.107524.110", url: "https://doi.org/10.1101/gr.107524.110" },
        { title: "Scaling accurate genetic variant discovery to tens of thousands of samples", authors: "Poplin et al.", journal: "bioRxiv", doi: "10.1101/201178", url: "https://doi.org/10.1101/201178" }
      ],
      examples: [
        { title: "Somatic Short Mutation Calling", desc: "The official GATK tutorial for running Mutect2 on a tumor-normal pair." }
      ]
    }
  },
  {
    id: "l_onco",
    name: "NF-Core OncoAnalyzer (v2.3.0)",
    shortName: "OncoAnalyzer",
    color: "var(--line-onco)",
    status: "review",
    scope: "clinical",
    omicsCategory: "DNA",
    technology: "Illumina",
    stops: ["s_fastp", "s_bwamem2", "s_markdup", "s_strelka2", "s_vep", "s_multiqc"],
    clinical: {
      specimen: "Fresh-frozen tissue, FFPE",
      minDNA: "≥ 50 ng",
      coverage: "≥ 80× tumor, ≥ 40× normal",
      lod: "~3% VAF (Strelka2 higher indel sensitivity)",
      reportableRange: "SNVs, indels, structural variants (with Manta)",
      tat: "4–6 h per sample pair on 32-core node",
    },
    supportedVariants: ["SNV", "Indel", "CNV", "SV", "RNA Fusion"],
    wiki: {
      theory: `
OncoAnalyzer is a specialized \`nf-core\` pipeline designed specifically for comprehensive oncology analysis, often merging DNA (WGS/WES/Panel) and RNA (transcriptome) data.

### Key Differentiators
*   **Speed**: It often leverages \`Strelka2\` over \`Mutect2\` for significantly faster turnaround times.
*   **Purity & Ploidy**: Integrates specialized tools like \`PURPLE\` for highly accurate tumor purity and ploidy estimation.
*   **Comprehensive Features**: Focuses heavily on somatic variant curation, RNA fusion calling (with \`Arriba\` and \`STAR-Fusion\`), and mutational signatures extraction.

> It is the pipeline of choice for precision oncology programs requiring rapid, multi-omic integration.
      `,
      publications: [
        { title: "The nf-core framework for community-curated bioinformatics pipelines", authors: "Ewels et al.", journal: "Nature Biotechnology", doi: "10.1038/s41587-020-0439-x", url: "https://doi.org/10.1038/s41587-020-0439-x" }
      ],
      examples: [
        { title: "OncoAnalyzer UMCCR documentation", desc: "Guidelines from the University of Melbourne Centre for Cancer Research on interpreting OncoAnalyzer outputs." }
      ]
    }
  }
];
