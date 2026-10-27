export interface FileInfo {
  name: string;       // e.g. "sample_R1.fq.gz"
  format: string;     // e.g. "FASTQ"
  description: string; // e.g. "Raw paired-end reads"
}

export interface Step {
  id: string;
  label: string;
  omics: OmicsCategory;
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
  row?: number; // map row for branches: -1 = one row above centre, 2 = two rows below
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

export type VariantType = "SNV" | "Indel" | "CNV" | "SV" | "RNA Fusion" | "Expression";

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
  { term: "GVCF", definition: "Genomic VCF — a per-sample VCF that also records reference-confidence blocks, so many samples can be jointly genotyped later." },
  { term: "VQSR", definition: "Variant Quality Score Recalibration — a GATK machine-learning filter for cohort germline calls, trained on known high-confidence variant sites." },
  { term: "TPM", definition: "Transcripts Per Million — a within-sample normalised expression unit that corrects for transcript length and sequencing depth." },
  { term: "Tumor purity", definition: "The fraction of cells in a tumour sample that are cancer cells; it caps the VAF a clonal somatic variant can reach." },
];

export const SITE_NAME = "MetrOmics";
export const SITE_TAGLINE = "Consolidated pipeline recommendations for multi-omic analysis";
export const DISCUSSIONS_URL = "https://github.com/bioinformaticstaskforce/wikipage/discussions";

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
  { id: "RNA", label: "RNA", icon: "📝", description: "Transcriptomics, differential expression, fusion detection", available: true },
  { id: "Methylation", label: "Methylation", icon: "🔬", description: "Bisulfite sequencing, methylation profiling, DMR analysis", available: false },
  { id: "Proteomics", label: "Proteomics", icon: "🔷", description: "Mass spectrometry-based protein identification & quantification", available: false },
  { id: "Fragmentomics", label: "Fragmentomics", icon: "🧩", description: "cfDNA fragment size analysis, nucleosome positioning", available: false },
];

export const STEPS: Step[] = [
  { id: "input", label: "Input", omics: "DNA" },
  { id: "qc", label: "QC & Trim", omics: "DNA" },
  { id: "align", label: "Alignment", omics: "DNA" },
  { id: "postproc", label: "Post-process", omics: "DNA" },
  { id: "calling", label: "SNV / Indel", omics: "DNA" },
  { id: "structural", label: "SV / CNV", omics: "DNA" },
  { id: "filtering", label: "Filtering", omics: "DNA" },
  { id: "annotation", label: "Annotation", omics: "DNA" },
  { id: "reporting", label: "Reporting", omics: "DNA" },
  { id: "r_qc", label: "QC & Trim", omics: "RNA" },
  { id: "r_align", label: "Alignment", omics: "RNA" },
  { id: "r_quant", label: "Quantification", omics: "RNA" },
  { id: "r_de", label: "Differential Expr.", omics: "RNA" },
  { id: "r_fusion", label: "Fusion Calling", omics: "RNA" },
  { id: "r_report", label: "Reporting", omics: "RNA" },
];

export const stepsFor = (omics: OmicsCategory) => STEPS.filter((s) => s.omics === omics);
export const linesFor = (omics: OmicsCategory) => LINES.filter((l) => l.omicsCategory === omics);

/* Wizard goal → recommended line; cfDNA needs the UMI-aware route */
export function recommendLine(goal: string, material: string): string {
  if (goal === 'somatic') return material === 'cfdna' ? 'l_sarek_umi' : 'l_sarek';
  if (goal === 'germline') return 'l_gatk_germline';
  if (goal === 'comprehensive') return 'l_onco';
  return '';
}


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
  },

  /* ── DNA: input ─────────────────────────────────── */
  samplesheet: {
    name: "FASTQ + Samplesheet",
    hint: "Raw reads plus a CSV that tells the pipeline which files belong to which sample.",
    simple: "Every run starts from paired FASTQ files and a samplesheet: one row per sequencing lane, linking each file to a patient, a sample and its tumour/normal status.",
    technical: "nf-core/sarek columns: patient,sex,status,sample,lane,fastq_1,fastq_2 (status 0 = normal, 1 = tumour). BAM/CRAM input is also accepted when restarting from a later step. All runs must use the same reference build (GRCh38 recommended).",
    pros: ["One file describes the whole cohort", "Lets the pipeline pair tumour and normal automatically"],
    cons: ["Typos in sample or patient IDs silently break tumour/normal pairing"],
    criteria: "Check MD5 checksums of the FASTQs on receipt and keep the samplesheet under version control next to the results.",
    links: [{ label: "Sarek samplesheet format", url: "https://nf-co.re/sarek/usage" }],
    outputFiles: [
      { name: "samplesheet.csv", format: "CSV", description: "Sample → FASTQ mapping" },
      { name: "*_R1.fq.gz / *_R2.fq.gz", format: "FASTQ", description: "Raw paired-end reads" },
    ],
  },

  /* ── DNA: post-processing ───────────────────────── */
  fgbio: {
    name: "fgbio (UMI consensus)",
    hint: "Collapses reads sharing a UMI into one error-corrected consensus read.",
    simple: "In liquid biopsy, real mutations can be rarer than sequencing errors. UMIs tag each original DNA molecule, so reads copied from the same molecule can be merged and random errors voted out.",
    technical: "GroupReadsByUmi groups reads by mapping position + UMI; CallMolecularConsensusReads builds single-strand consensus reads; FilterConsensusReads drops low-support consensus reads. Consensus reads are re-aligned before variant calling. Built into nf-core/sarek via --umi_read_structure.",
    pros: ["Makes sub-1% VAF detection feasible", "True duplicate removal instead of position-based guessing"],
    cons: ["Requires UMI-aware library prep", "Needs very deep raw coverage (often > 5,000×) to yield enough consensus depth"],
    criteria: "Mandatory for cfDNA/ctDNA. Report consensus (not raw) depth when stating the limit of detection.",
    params: "fgbio GroupReadsByUmi -i mapped.bam -o grouped.bam -s Adjacency -e 1 && fgbio CallMolecularConsensusReads -i grouped.bam -o consensus.unmapped.bam -M 1 && fgbio FilterConsensusReads -i consensus.mapped.bam -o consensus.filtered.bam -r ref.fa -M 3 -N 30",
    links: [{ label: "fgbio docs", url: "https://fulcrumgenomics.github.io/fgbio/" }],
    inputFiles: [{ name: "mapped.bam", format: "BAM", description: "Aligned reads with UMI in the RX tag" }],
    outputFiles: [{ name: "consensus.filtered.bam", format: "BAM", description: "Error-corrected consensus reads" }],
  },
  redux: {
    name: "REDUX",
    hint: "Hartwig's duplicate marking, also unmasks microsatellite errors.",
    simple: "Hartwig Medical Foundation's replacement for MarkDuplicates. Besides flagging duplicates it models sequencing errors in repetitive regions, which the downstream Hartwig callers use.",
    technical: "Runs inside nf-core/oncoanalyser after BWA-MEM2. Outputs a duplicate-marked BAM plus jitter (microsatellite error) parameters consumed by SAGE. Can also collapse UMIs.",
    pros: ["Tuned for the Hartwig toolchain", "UMI support built in"],
    cons: ["Rarely used outside the Hartwig/oncoanalyser ecosystem"],
    links: [{ label: "Hartwig tools (hmftools)", url: "https://github.com/hartwigmedical/hmftools" }],
    inputFiles: [{ name: "sorted.bam", format: "BAM", description: "Coordinate-sorted aligned reads" }],
    outputFiles: [{ name: "redux.bam", format: "BAM", description: "Duplicate-marked reads" }],
  },

  /* ── DNA: small-variant calling ─────────────────── */
  haplotypecaller: {
    name: "HaplotypeCaller",
    hint: "GATK's germline SNV/indel caller.",
    simple: "Finds inherited variants by re-assembling reads locally wherever the sample looks different from the reference. The standard germline caller in GATK Best Practices.",
    technical: "Run per sample in -ERC GVCF mode, then combine samples with GenomicsDBImport and GenotypeGVCFs (joint genotyping). Diploid model; not suitable for somatic calling.",
    pros: ["Reference germline caller for clinical validations", "GVCF workflow scales to large cohorts"],
    cons: ["Slower than DeepVariant on GPU", "Needs VQSR or hard filters downstream"],
    criteria: "Use for germline WGS/WES. Single samples: apply hard filters; cohorts ≥ 30 exomes or WGS: use VQSR.",
    params: "gatk HaplotypeCaller -R ref.fa -I recal.bam -O sample.g.vcf.gz -ERC GVCF",
    links: [{ label: "GATK HaplotypeCaller", url: "https://gatk.broadinstitute.org/hc/en-us/articles/360037225632-HaplotypeCaller" }],
    inputFiles: [
      { name: "recal.bam", format: "BAM", description: "BQSR-recalibrated reads" },
      { name: "ref.fa", format: "FASTA", description: "Reference genome" },
    ],
    outputFiles: [{ name: "sample.g.vcf.gz", format: "VCF", description: "Per-sample GVCF" }],
  },
  deepvariant: {
    name: "DeepVariant",
    hint: "Google's deep-learning germline caller — top accuracy in benchmarks.",
    simple: "Turns the reads around each candidate site into an image and lets a neural network decide whether there is a variant. Consistently among the most accurate germline callers in public benchmarks.",
    technical: "Pre-trained models per data type (WGS, WES, PACBIO, ONT_R104). Does not need BQSR or VQSR. Multi-sample cohorts are merged with GLnexus.",
    pros: ["Very high SNV and indel accuracy", "No recalibration or filtering model to tune", "Models for long reads too"],
    cons: ["Germline only (use DeepSomatic for tumours)", "CPU runtime is high without a GPU"],
    criteria: "Recommended germline caller when compute allows. Pick the --model_type that matches the assay.",
    params: "run_deepvariant --model_type=WGS --ref=ref.fa --reads=dedup.bam --output_vcf=sample.vcf.gz --output_gvcf=sample.g.vcf.gz --num_shards=16",
    links: [{ label: "DeepVariant GitHub", url: "https://github.com/google/deepvariant" }],
    inputFiles: [
      { name: "dedup.bam", format: "BAM", description: "Duplicate-marked reads" },
      { name: "ref.fa", format: "FASTA", description: "Reference genome" },
    ],
    outputFiles: [
      { name: "sample.vcf.gz", format: "VCF", description: "Germline variant calls" },
      { name: "sample.g.vcf.gz", format: "VCF", description: "GVCF for cohort merging" },
    ],
  },
  sage: {
    name: "SAGE",
    hint: "Hartwig's somatic SNV/indel caller, sensitive at low VAF.",
    simple: "Somatic caller from the Hartwig Medical Foundation. It scores each candidate with a tiered approach (hotspot, panel, genome-wide) so known cancer hotspots are reported even at low allele frequency.",
    technical: "Runs inside nf-core/oncoanalyser. Uses REDUX jitter models; output is annotated by PAVE and its allele frequencies are purity-adjusted by PURPLE.",
    pros: ["Good sensitivity at low VAF in hotspots", "Fast", "Designed together with purity/ploidy modelling"],
    cons: ["Best used inside the full Hartwig toolchain", "Needs the HMF resource bundle"],
    links: [{ label: "SAGE docs", url: "https://github.com/hartwigmedical/hmftools/tree/master/sage" }],
    inputFiles: [
      { name: "tumor.redux.bam", format: "BAM", description: "Tumour reads" },
      { name: "normal.redux.bam", format: "BAM", description: "Matched normal reads" },
    ],
    outputFiles: [{ name: "tumor.sage.somatic.vcf.gz", format: "VCF", description: "Somatic SNV/indel calls" }],
  },

  /* ── DNA: structural / copy-number ──────────────── */
  manta: {
    name: "Manta",
    hint: "Fast structural-variant caller, usually paired with Strelka2.",
    simple: "Finds large rearrangements — deletions, duplications, inversions, translocations — from read pairs and split reads. Its candidate indels also improve Strelka2's small-indel calls.",
    technical: "Germline and tumour/normal modes. Outputs diploidSV / somaticSV VCFs plus candidateSmallIndels.vcf.gz for Strelka2. Available in nf-core/sarek with --tools manta.",
    pros: ["Fast", "Somatic and germline modes", "Improves Strelka2 indel sensitivity"],
    cons: ["Archived upstream (no new development)", "Limited sensitivity for SVs in repeats"],
    criteria: "Run alongside Strelka2. For clinical SV reporting, confirm events with a second caller or orthogonal method.",
    params: "configManta.py --normalBam normal.bam --tumorBam tumor.bam --referenceFasta ref.fa --runDir manta_run && manta_run/runWorkflow.py -j 16",
    links: [{ label: "Manta GitHub", url: "https://github.com/Illumina/manta" }],
    inputFiles: [
      { name: "tumor.bam", format: "BAM", description: "Tumour reads" },
      { name: "normal.bam", format: "BAM", description: "Matched normal reads" },
    ],
    outputFiles: [
      { name: "somaticSV.vcf.gz", format: "VCF", description: "Somatic structural variants" },
      { name: "candidateSmallIndels.vcf.gz", format: "VCF", description: "Indel candidates for Strelka2" },
    ],
  },
  cnvkit: {
    name: "CNVkit",
    hint: "Copy-number caller that works on panels, exomes and genomes.",
    simple: "Estimates gains and losses of DNA by comparing read depth against a reference built from normal samples. Works well on targeted panels, where many other CNV tools struggle.",
    technical: "Uses on-target and off-target reads. 'batch' builds the reference and calls segments in one go; use --method wgs for genomes. Available in nf-core/sarek with --tools cnvkit.",
    pros: ["Handles targeted panels and WES", "Good plots for review", "Works with a pooled normal reference"],
    cons: ["Absolute copy number needs a purity estimate", "Noisy on low-quality FFPE samples"],
    criteria: "Build the reference from normals sequenced with the same assay and kit version.",
    params: "cnvkit.py batch tumor.bam --normal normal.bam --targets targets.bed --fasta ref.fa --annotate refFlat.txt --output-reference reference.cnn --output-dir cnvkit_out -p 8",
    links: [{ label: "CNVkit docs", url: "https://cnvkit.readthedocs.io/" }],
    inputFiles: [
      { name: "tumor.bam", format: "BAM", description: "Tumour reads" },
      { name: "targets.bed", format: "BED", description: "Capture target regions" },
    ],
    outputFiles: [
      { name: "tumor.cns", format: "TSV", description: "Copy-number segments" },
      { name: "tumor-scatter.png", format: "PNG", description: "Genome-wide copy-number plot" },
    ],
  },
  esvee: {
    name: "ESVEE",
    hint: "Hartwig's structural-variant caller (successor of GRIDSS/GRIPSS).",
    simple: "Hartwig's structural-variant caller. It assembles reads around breakpoints to find rearrangements, including complex events that are typical of cancer genomes.",
    technical: "Runs inside nf-core/oncoanalyser; replaces the earlier GRIDSS + GRIPSS steps. Output feeds PURPLE (copy-number consistency) and LINX (event interpretation).",
    pros: ["Assembly-based breakpoint resolution", "Integrated with purity and SV interpretation"],
    cons: ["Tied to the Hartwig toolchain"],
    links: [{ label: "Hartwig tools (hmftools)", url: "https://github.com/hartwigmedical/hmftools" }],
    outputFiles: [{ name: "tumor.esvee.somatic.vcf.gz", format: "VCF", description: "Somatic structural variants" }],
  },
  purple: {
    name: "PURPLE",
    hint: "Estimates tumour purity and ploidy, and calls copy number.",
    simple: "Works out what fraction of the sample is tumour and how many genome copies the tumour has, then calls copy-number changes. These numbers are needed to interpret every other variant correctly.",
    technical: "Combines AMBER (B-allele frequency) and COBALT (read-depth ratio) with SAGE and ESVEE calls. Also reports whole-genome duplication, microsatellite instability (MSI) and tumour mutational burden (TMB).",
    pros: ["Purity-aware copy number", "Reports MSI and TMB", "Checks SNVs, SVs and copy number against each other"],
    cons: ["Designed for WGS; panel mode is more limited"],
    links: [{ label: "PURPLE docs", url: "https://github.com/hartwigmedical/hmftools/tree/master/purple" }],
    outputFiles: [
      { name: "tumor.purple.purity.tsv", format: "TSV", description: "Purity, ploidy, MSI, TMB" },
      { name: "tumor.purple.cnv.somatic.tsv", format: "TSV", description: "Copy-number segments" },
    ],
  },

  /* ── DNA: filtering ─────────────────────────────── */
  gatk_contamination: {
    name: "Contamination + Orientation",
    hint: "The two models FilterMutectCalls needs: sample contamination and read-orientation artifacts.",
    simple: "Before Mutect2 calls can be filtered, GATK estimates how much foreign DNA is in the tumour sample and learns the strand-specific artifacts typical of FFPE and oxidative damage.",
    technical: "GetPileupSummaries (tumour and normal) → CalculateContamination produces contamination.table and segments.table. LearnReadOrientationModel turns Mutect2's f1r2.tar.gz into artifact-priors.tar.gz.",
    pros: ["Large reduction of FFPE false positives", "Contamination estimate doubles as a QC metric"],
    cons: ["Extra steps and a common-variant resource file to maintain"],
    criteria: "Mandatory for FFPE. Flag samples with contamination > 2–3% for review.",
    params: "gatk GetPileupSummaries -I tumor.bam -V small_exac_common.vcf.gz -L small_exac_common.vcf.gz -O tumor.pileups.table && gatk CalculateContamination -I tumor.pileups.table -matched normal.pileups.table -O contamination.table --tumor-segmentation segments.table && gatk LearnReadOrientationModel -I f1r2.tar.gz -O artifact-priors.tar.gz",
    links: [{ label: "GATK somatic short variant workflow", url: "https://gatk.broadinstitute.org/hc/en-us/articles/360035894731-Somatic-short-variant-discovery-SNVs-Indels-" }],
    inputFiles: [
      { name: "tumor.bam", format: "BAM", description: "Tumour reads" },
      { name: "f1r2.tar.gz", format: "TAR.GZ", description: "Orientation counts from Mutect2" },
    ],
    outputFiles: [
      { name: "contamination.table", format: "TABLE", description: "Contamination estimate" },
      { name: "artifact-priors.tar.gz", format: "TAR.GZ", description: "Orientation bias model" },
    ],
  },
  gatk_vqsr: {
    name: "Joint Genotyping + VQSR",
    hint: "Genotypes a cohort together, then filters with a model trained on known variants.",
    simple: "Germline samples are genotyped together so that weak evidence in one sample is supported by the others. A model trained on trusted variant sets then separates real variants from artifacts.",
    technical: "GenomicsDBImport → GenotypeGVCFs → VariantRecalibrator + ApplyVQSR, run separately for SNPs and indels. Newer GATK releases offer VETS (ScoreVariantAnnotations) as a successor. Single samples should use hard filters (VariantFiltration) instead.",
    pros: ["Cohort-level sensitivity", "Data-driven filtering thresholds"],
    cons: ["Needs ≥ 30 exomes or a WGS cohort to train", "Several resource VCFs (HapMap, Omni, 1000G, dbSNP)"],
    criteria: "Use 99.7% truth-sensitivity for SNPs and 99.0% for indels as a starting point.",
    params: "gatk GenotypeGVCFs -R ref.fa -V gendb://cohort_db -O cohort.vcf.gz && gatk VariantRecalibrator -R ref.fa -V cohort.vcf.gz --resource:hapmap,known=false,training=true,truth=true,prior=15.0 hapmap.vcf.gz --resource:omni,known=false,training=true,truth=false,prior=12.0 omni.vcf.gz --resource:1000G,known=false,training=true,truth=false,prior=10.0 1000G.snps.vcf.gz --resource:dbsnp,known=true,training=false,truth=false,prior=2.0 dbsnp.vcf.gz -an QD -an MQ -an FS -an SOR -an MQRankSum -an ReadPosRankSum -mode SNP -O snps.recal --tranches-file snps.tranches && gatk ApplyVQSR -R ref.fa -V cohort.vcf.gz --recal-file snps.recal --tranches-file snps.tranches --truth-sensitivity-filter-level 99.7 -mode SNP -O cohort.snps.vqsr.vcf.gz",
    links: [{ label: "GATK VQSR", url: "https://gatk.broadinstitute.org/hc/en-us/articles/360035531612-Variant-Quality-Score-Recalibration-VQSR" }],
    inputFiles: [{ name: "*.g.vcf.gz", format: "VCF", description: "Per-sample GVCFs" }],
    outputFiles: [{ name: "cohort.snps.vqsr.vcf.gz", format: "VCF", description: "Filtered cohort calls" }],
  },

  /* ── DNA: annotation & reporting ────────────────── */
  snpeff: {
    name: "SnpEff",
    hint: "Fast variant effect annotator, an alternative to VEP.",
    simple: "Predicts what each variant does to genes and proteins (missense, frameshift, splice…). Lighter to install than VEP; often paired with SnpSift to add ClinVar or gnomAD fields.",
    technical: "Uses pre-built genome databases (e.g. GRCh38.105). Adds an ANN field to the VCF. Available in nf-core/sarek with --tools snpeff.",
    pros: ["Fast, small databases", "Simple Java setup"],
    cons: ["Fewer clinical plugins than VEP", "Transcript choice must be checked against your reporting standard"],
    params: "snpEff -Xmx8g GRCh38.105 filtered.vcf.gz > annotated.snpeff.vcf",
    links: [{ label: "SnpEff docs", url: "https://pcingola.github.io/SnpEff/" }],
    inputFiles: [{ name: "filtered.vcf.gz", format: "VCF", description: "Filtered calls" }],
    outputFiles: [{ name: "annotated.snpeff.vcf", format: "VCF", description: "Variants with ANN field" }],
  },
  pave: {
    name: "PAVE",
    hint: "Hartwig's variant annotator: gene impact plus panel-of-normals filtering.",
    simple: "Annotates SAGE calls with their effect on genes and removes recurrent artifacts using Hartwig's panel of normals.",
    technical: "Runs inside nf-core/oncoanalyser using the Ensembl data cache from the HMF resource bundle.",
    pros: ["Built for the Hartwig calls", "Artifact filtering included"],
    cons: ["Hartwig-specific output format"],
    links: [{ label: "PAVE docs", url: "https://github.com/hartwigmedical/hmftools/tree/master/pave" }],
  },
  linx: {
    name: "LINX",
    hint: "Interprets structural variants: fusions, chained events, driver disruptions.",
    simple: "Groups structural variants into biological events, finds gene fusions at the DNA level and flags disrupted driver genes.",
    technical: "Uses ESVEE SVs and PURPLE copy number. Also produces the input for the linxreport visualisations.",
    pros: ["Calls DNA-level fusions", "Explains complex rearrangements"],
    cons: ["Hartwig toolchain only"],
    links: [{ label: "LINX docs", url: "https://github.com/hartwigmedical/hmftools/tree/master/linx" }],
  },
  orange: {
    name: "ORANGE",
    hint: "One PDF/JSON summary of the whole Hartwig analysis.",
    simple: "Collects purity, drivers, fusions, MSI, TMB and QC from all Hartwig tools into one report for review.",
    technical: "Final step of nf-core/oncoanalyser. The JSON output is suitable for loading into downstream reporting systems.",
    pros: ["Single review document", "Machine-readable JSON"],
    cons: ["Research report, not a validated clinical report"],
    links: [{ label: "ORANGE docs", url: "https://github.com/hartwigmedical/hmftools/tree/master/orange" }],
    outputFiles: [
      { name: "tumor.orange.pdf", format: "PDF", description: "Summary report" },
      { name: "tumor.orange.json", format: "JSON", description: "Machine-readable summary" },
    ],
  },

  /* ── RNA ────────────────────────────────────────── */
  trimgalore: {
    name: "Trim Galore",
    hint: "Adapter and quality trimming — the nf-core/rnaseq default.",
    simple: "Removes adapter sequences and low-quality ends from reads, and runs FastQC on the result.",
    technical: "Wrapper around Cutadapt that auto-detects the adapter. The default trimmer in nf-core/rnaseq (fastp is the alternative).",
    pros: ["Adapter auto-detection", "Built-in FastQC run"],
    cons: ["Slower than fastp"],
    params: "trim_galore --paired --cores 4 --fastqc R1.fq.gz R2.fq.gz",
    links: [{ label: "Trim Galore GitHub", url: "https://github.com/FelixKrueger/TrimGalore" }],
    inputFiles: [{ name: "R1.fq.gz / R2.fq.gz", format: "FASTQ", description: "Raw paired-end reads" }],
    outputFiles: [{ name: "R1_val_1.fq.gz / R2_val_2.fq.gz", format: "FASTQ", description: "Trimmed reads" }],
  },
  star: {
    name: "STAR",
    hint: "Splice-aware aligner, the standard for RNA-seq.",
    simple: "Aligns RNA reads to the genome while allowing them to span introns. It also detects chimeric reads, which fusion callers use.",
    technical: "Needs a genome index built with the matching GTF (~32 GB RAM for human). --quantMode TranscriptomeSAM produces the transcriptome BAM Salmon quantifies; chimeric output (--chimSegmentMin) feeds Arriba and STAR-Fusion.",
    pros: ["Fast and accurate splice-aware alignment", "One alignment serves quantification and fusion calling"],
    cons: ["High memory use", "Index must be rebuilt for every annotation change"],
    criteria: "Use the same genome and GTF version for STAR, Salmon and annotation.",
    params: "STAR --runThreadN 16 --genomeDir star_index/ --readFilesIn R1.fq.gz R2.fq.gz --readFilesCommand zcat --outSAMtype BAM SortedByCoordinate --quantMode TranscriptomeSAM --outFileNamePrefix sample.",
    links: [{ label: "STAR GitHub", url: "https://github.com/alexdobin/STAR" }],
    inputFiles: [
      { name: "R1.fq.gz / R2.fq.gz", format: "FASTQ", description: "Trimmed reads" },
      { name: "star_index/", format: "Directory", description: "STAR genome index" },
    ],
    outputFiles: [
      { name: "sample.Aligned.sortedByCoord.out.bam", format: "BAM", description: "Genome alignments" },
      { name: "sample.Aligned.toTranscriptome.out.bam", format: "BAM", description: "Transcriptome alignments for Salmon" },
    ],
  },
  salmon: {
    name: "Salmon",
    hint: "Fast, bias-aware transcript quantification.",
    simple: "Counts how many reads come from each transcript, correcting for known biases such as GC content and fragment position.",
    technical: "In nf-core/rnaseq's default star_salmon route Salmon quantifies STAR's transcriptome BAM. It can also run alone in pseudo-alignment mode. Gene-level counts are produced with tximport.",
    pros: ["Accurate and fast", "Corrects sequence and GC bias"],
    cons: ["No genome BAM when run without STAR (needed for QC and visualisation)"],
    params: "salmon quant -t transcripts.fa -l A -a sample.Aligned.toTranscriptome.out.bam -p 8 -o salmon_out",
    links: [{ label: "Salmon docs", url: "https://salmon.readthedocs.io/" }],
    inputFiles: [{ name: "sample.Aligned.toTranscriptome.out.bam", format: "BAM", description: "Transcriptome alignments" }],
    outputFiles: [{ name: "quant.sf", format: "TSV", description: "Transcript counts and TPM" }],
  },
  deseq2: {
    name: "DESeq2",
    hint: "Finds genes that change expression between conditions.",
    simple: "Compares gene counts between groups (e.g. tumour vs normal, treated vs untreated) and reports which genes go up or down, with statistics that account for small sample sizes.",
    technical: "Negative binomial GLM with shrinkage of dispersions and fold changes. Needs raw counts (not TPM). nf-core/differentialabundance runs it from an nf-core/rnaseq count matrix.",
    pros: ["Well-established, reliable with few replicates", "Supports complex designs (batch, paired samples)"],
    cons: ["Slow on very large cohorts", "Design formula must be specified correctly"],
    criteria: "At least 3 biological replicates per group. Include known batch effects in the design formula.",
    params: "Rscript -e 'library(DESeq2); dds <- DESeqDataSetFromMatrix(counts, colData, design = ~ batch + condition); res <- results(DESeq(dds)); write.csv(as.data.frame(res), \"deseq2_results.csv\")'",
    links: [{ label: "DESeq2 (Bioconductor)", url: "https://bioconductor.org/packages/DESeq2/" }],
    inputFiles: [{ name: "salmon.merged.gene_counts.tsv", format: "TSV", description: "Gene count matrix" }],
    outputFiles: [{ name: "deseq2_results.csv", format: "CSV", description: "Fold changes and adjusted p-values" }],
  },
  arriba: {
    name: "Arriba",
    hint: "Fast, sensitive fusion caller using STAR's chimeric reads.",
    simple: "Finds gene fusions — two genes joined together, a common cancer driver — using the chimeric reads STAR already found during alignment.",
    technical: "Reads the STAR BAM with chimeric alignments; uses a blacklist of recurrent artifacts and a list of known fusions. Produces publication-quality fusion plots.",
    pros: ["Very fast (reuses STAR alignment)", "High sensitivity", "Good plots"],
    cons: ["Depends on STAR's chimeric settings"],
    params: "arriba -x sample.Aligned.out.bam -g annotation.gtf -a ref.fa -b blacklist.tsv.gz -k known_fusions.tsv.gz -p protein_domains.gff3 -o fusions.tsv -O fusions.discarded.tsv",
    links: [{ label: "Arriba docs", url: "https://github.com/suhrig/arriba" }],
    inputFiles: [{ name: "sample.Aligned.out.bam", format: "BAM", description: "STAR BAM with chimeric reads" }],
    outputFiles: [{ name: "fusions.tsv", format: "TSV", description: "Fusion calls" }],
  },
  starfusion: {
    name: "STAR-Fusion",
    hint: "The CTAT fusion caller from the Broad Institute.",
    simple: "Another fusion caller built on STAR. Running it next to Arriba and keeping fusions found by both gives a high-confidence list.",
    technical: "Needs the CTAT genome library. FusionInspector can be used afterwards to validate candidates in silico.",
    pros: ["Well-validated", "Large curated genome library"],
    cons: ["CTAT library is large (~30 GB)"],
    params: "STAR-Fusion --genome_lib_dir ctat_genome_lib/ --left_fq R1.fq.gz --right_fq R2.fq.gz --output_dir star_fusion_out --CPU 8",
    links: [{ label: "STAR-Fusion GitHub", url: "https://github.com/STAR-Fusion/STAR-Fusion" }],
    outputFiles: [{ name: "star-fusion.fusion_predictions.tsv", format: "TSV", description: "Fusion calls" }],
  },
  fusioncatcher: {
    name: "FusionCatcher",
    hint: "Fusion caller with its own aligners, independent of STAR.",
    simple: "A third fusion caller that uses its own alignment strategy, so it can find fusions the STAR-based callers miss.",
    technical: "Needs its own database. nf-core/rnafusion trims reads with fastp specifically for FusionCatcher.",
    pros: ["Independent evidence from STAR-based callers"],
    cons: ["Slow", "Large database"],
    params: "fusioncatcher -d fusioncatcher_db/ -i R1.fq.gz,R2.fq.gz -o fusioncatcher_out -p 8",
    links: [{ label: "FusionCatcher GitHub", url: "https://github.com/ndaniel/fusioncatcher" }],
    outputFiles: [{ name: "final-list_candidate-fusion-genes.txt", format: "TXT", description: "Fusion calls" }],
  },
};

/* One "hub" per step at most: hubs share the centre row of the map. */
export const STATIONS: Station[] = [
  /* DNA */
  { id: "s_input", stepId: "input", toolId: "samplesheet", type: "file" },
  { id: "s_fastqc", stepId: "qc", toolId: "fastqc", type: "hub" },
  { id: "s_fastp", stepId: "qc", toolId: "fastp", type: "branch", row: -1 },
  { id: "s_adapterremoval", stepId: "qc", toolId: "adapterremoval", type: "branch", row: 1 },
  { id: "s_bwamem2", stepId: "align", toolId: "bwamem2", type: "hub" },
  { id: "s_dragmap", stepId: "align", toolId: "dragmap", type: "branch", row: -1 },
  { id: "s_markdup", stepId: "postproc", toolId: "gatk_markduplicates", type: "hub" },
  { id: "s_bqsr", stepId: "postproc", toolId: "gatk_bqsr", type: "branch", row: -1 },
  { id: "s_fgbio", stepId: "postproc", toolId: "fgbio", type: "branch", row: -2 },
  { id: "s_redux", stepId: "postproc", toolId: "redux", type: "branch", row: 1 },
  { id: "s_mutect2", stepId: "calling", toolId: "mutect2", type: "hub" },
  { id: "s_strelka2", stepId: "calling", toolId: "strelka2", type: "branch", row: -1 },
  { id: "s_haplotypecaller", stepId: "calling", toolId: "haplotypecaller", type: "branch", row: -2 },
  { id: "s_deepvariant", stepId: "calling", toolId: "deepvariant", type: "branch", row: 2 },
  { id: "s_sage", stepId: "calling", toolId: "sage", type: "branch", row: 1 },
  { id: "s_manta", stepId: "structural", toolId: "manta", type: "hub" },
  { id: "s_cnvkit", stepId: "structural", toolId: "cnvkit", type: "branch", row: -1 },
  { id: "s_esvee", stepId: "structural", toolId: "esvee", type: "branch", row: 1 },
  { id: "s_purple", stepId: "structural", toolId: "purple", type: "branch", row: 2 },
  { id: "s_filter", stepId: "filtering", toolId: "gatk_filtermutectcalls", type: "hub" },
  { id: "s_contam", stepId: "filtering", toolId: "gatk_contamination", type: "branch", row: -1 },
  { id: "s_vqsr", stepId: "filtering", toolId: "gatk_vqsr", type: "branch", row: -2 },
  { id: "s_vep", stepId: "annotation", toolId: "vep", type: "hub" },
  { id: "s_snpeff", stepId: "annotation", toolId: "snpeff", type: "branch", row: -1 },
  { id: "s_pave", stepId: "annotation", toolId: "pave", type: "branch", row: 1 },
  { id: "s_linx", stepId: "annotation", toolId: "linx", type: "branch", row: 2 },
  { id: "s_multiqc", stepId: "reporting", toolId: "multiqc", type: "hub" },
  { id: "s_orange", stepId: "reporting", toolId: "orange", type: "branch", row: 1 },
  /* RNA — DE and fusion columns have no hub so lines that skip them don't cross a station */
  { id: "s_r_fastqc", stepId: "r_qc", toolId: "fastqc", type: "hub" },
  { id: "s_r_trimgalore", stepId: "r_qc", toolId: "trimgalore", type: "branch", row: -1 },
  { id: "s_r_fastp", stepId: "r_qc", toolId: "fastp", type: "branch", row: 1 },
  { id: "s_r_star", stepId: "r_align", toolId: "star", type: "hub" },
  { id: "s_r_salmon", stepId: "r_quant", toolId: "salmon", type: "hub" },
  { id: "s_r_deseq2", stepId: "r_de", toolId: "deseq2", type: "branch", row: -1 },
  { id: "s_r_arriba", stepId: "r_fusion", toolId: "arriba", type: "branch", row: -1 },
  { id: "s_r_starfusion", stepId: "r_fusion", toolId: "starfusion", type: "branch", row: -2 },
  { id: "s_r_fusioncatcher", stepId: "r_fusion", toolId: "fusioncatcher", type: "branch", row: 1 },
  { id: "s_r_multiqc", stepId: "r_report", toolId: "multiqc", type: "hub" },
];

const NFCORE_PUB = { title: "The nf-core framework for community-curated bioinformatics pipelines", authors: "Ewels et al.", journal: "Nature Biotechnology", doi: "10.1038/s41587-020-0439-x", url: "https://doi.org/10.1038/s41587-020-0439-x" };

export const LINES: Line[] = [
  {
    id: "l_sarek",
    name: "nf-core/sarek — Somatic (v3.11.0)",
    shortName: "Sarek",
    color: "#059669",
    status: "stable",
    scope: "clinical",
    omicsCategory: "DNA",
    technology: "Illumina",
    stops: ["s_input", "s_fastqc", "s_fastp", "s_bwamem2", "s_markdup", "s_bqsr", "s_mutect2", "s_strelka2", "s_manta", "s_cnvkit", "s_contam", "s_filter", "s_vep", "s_multiqc"],
    clinical: {
      specimen: "Fresh-frozen tissue, FFPE (with artifact filtering)",
      minDNA: "≥ 50 ng (200 ng recommended for WGS)",
      coverage: "≥ 60× tumor, ≥ 30× normal (WGS)",
      lod: "~5% VAF at 60× coverage",
      reportableRange: "SNVs, small indels (≤ 50 bp), SVs, CNVs",
      tat: "6–10 h per sample pair on 32-core node",
      accreditation: "Widely used in ISO 15189-compliant labs",
    },
    supportedVariants: ["SNV", "Indel", "CNV", "SV"],
    wiki: {
      theory: `
Sarek is a comprehensive Nextflow-based workflow for somatic and germline variant calling. It implements **GATK Best Practices** but offers extreme modularity: callers are switched on with \`--tools\`.

### Core Architecture
1.  **Alignment**: Supports swapping aligners (\`BWA-MEM2\`, \`BWA-MEM\`, \`DRAGMAP\`, Sentieon).
2.  **Somatic calling**:
    *   **SNVs/Indels**: Mutect2, Strelka2, MuSE, LoFreq, DeepSomatic
    *   **SVs**: Manta, TIDDIT
    *   **CNVs**: ASCAT, CNVkit, Control-FREEC
3.  **Annotation**: Ensembl VEP, SnpEff, BCFtools annotate.

The line on the map shows a common somatic setup: Mutect2 + Strelka2 for small variants, Manta for SVs and CNVkit for copy number. Its use of \`nf-core\` standards guarantees reproducibility across compute environments (Docker, Singularity, Conda, AWS, GCP).
      `,
      publications: [
        { title: "Scalable and efficient DNA sequencing analysis on different compute infrastructures aiding variant discovery", authors: "Hanssen et al.", journal: "NAR Genomics and Bioinformatics", doi: "10.1093/nargab/lqae031", url: "https://doi.org/10.1093/nargab/lqae031" },
        { title: "Sarek: A portable workflow for whole-genome sequencing analysis of germline and somatic variants", authors: "Garcia et al.", journal: "F1000Research", doi: "10.12688/f1000research.16665.2", url: "https://doi.org/10.12688/f1000research.16665.2" },
      ],
      examples: [
        { title: "Sarek usage documentation", desc: "Samplesheet format, --tools options and restarting from intermediate steps.", url: "https://nf-co.re/sarek/usage" },
      ],
    },
  },
  {
    id: "l_sarek_umi",
    name: "nf-core/sarek — UMI / Liquid Biopsy (v3.11.0)",
    shortName: "Sarek UMI",
    color: "#ca8a04",
    status: "review",
    scope: "clinical",
    omicsCategory: "DNA",
    technology: "Illumina",
    stops: ["s_input", "s_fastqc", "s_fastp", "s_bwamem2", "s_fgbio", "s_mutect2", "s_contam", "s_filter", "s_vep", "s_multiqc"],
    supportedVariants: ["SNV", "Indel"],
    wiki: {
      theory: `
Liquid biopsy looks for tumour DNA in blood, where it is often **well below 1% VAF** — lower than the raw sequencing error rate. Libraries are therefore prepared with **UMIs** (unique molecular identifiers).

### How Sarek handles UMIs
Setting \`--umi_read_structure\` makes Sarek run \`fgbio\`: reads are grouped by UMI and position, collapsed into consensus reads, and re-aligned. Variant calling then runs on the consensus BAM, where random PCR and sequencing errors have been voted out.

### Things to check
*   Report **consensus depth**, not raw depth, when stating the limit of detection.
*   Tune Mutect2 for low allele fractions and use a panel of normals built from the same assay.
      `,
      publications: [
        { title: "Detecting ultralow-frequency mutations by Duplex Sequencing", authors: "Kennedy et al.", journal: "Nature Protocols", doi: "10.1038/nprot.2014.170", url: "https://doi.org/10.1038/nprot.2014.170" },
      ],
      examples: [
        { title: "Sarek UMI parameters", desc: "Read-structure syntax and consensus-calling options.", url: "https://nf-co.re/sarek/usage" },
      ],
    },
  },
  {
    id: "l_gatk",
    name: "GATK Best Practices — Somatic",
    shortName: "GATK Somatic",
    color: "#2563eb",
    status: "stable",
    scope: "clinical",
    omicsCategory: "DNA",
    technology: "Illumina",
    stops: ["s_input", "s_fastqc", "s_bwamem2", "s_markdup", "s_bqsr", "s_mutect2", "s_contam", "s_filter"],
    clinical: {
      specimen: "Fresh-frozen tissue, FFPE",
      minDNA: "≥ 100 ng for WES, ≥ 1 µg for WGS",
      coverage: "≥ 100× target (WES), ≥ 30× (WGS)",
      lod: "~5–10% VAF depending on coverage and caller mode",
      reportableRange: "Somatic SNVs and small indels",
      tat: "4–8 h per sample (WES) on 16-core node",
      accreditation: "Broad Institute reference — basis for most clinical validations",
    },
    supportedVariants: ["SNV", "Indel"],
    wiki: {
      theory: `
The GATK Best Practices constitute the _de facto_ standard for variant discovery.

### Somatic short-variant workflow
1.  **Data Pre-processing**: \`MarkDuplicates\` and \`BaseRecalibrator\` (BQSR).
2.  **Calling**: \`Mutect2\` on the tumour (with matched normal, gnomAD germline resource and a panel of normals).
3.  **Models**: \`CalculateContamination\` estimates cross-sample contamination; \`LearnReadOrientationModel\` learns FFPE / oxidation artifacts.
4.  **Filtering**: \`FilterMutectCalls\` combines both models into the final filter.
      `,
      publications: [
        { title: "The Genome Analysis Toolkit: a MapReduce framework for analyzing next-generation DNA sequencing data", authors: "McKenna et al.", journal: "Genome Research", doi: "10.1101/gr.107524.110", url: "https://doi.org/10.1101/gr.107524.110" },
      ],
      examples: [
        { title: "Somatic Short Mutation Calling", desc: "The official GATK workflow for running Mutect2 on a tumor-normal pair.", url: "https://gatk.broadinstitute.org/hc/en-us/articles/360035894731-Somatic-short-variant-discovery-SNVs-Indels-" },
      ],
    },
  },
  {
    id: "l_gatk_germline",
    name: "GATK Best Practices — Germline",
    shortName: "GATK Germline",
    color: "#7c3aed",
    status: "stable",
    scope: "clinical",
    omicsCategory: "DNA",
    technology: "Illumina",
    stops: ["s_input", "s_fastqc", "s_bwamem2", "s_markdup", "s_bqsr", "s_haplotypecaller", "s_vqsr", "s_vep"],
    supportedVariants: ["SNV", "Indel"],
    wiki: {
      theory: `
The germline branch of the GATK Best Practices, used for inherited and rare-disease variants.

### Workflow
1.  **Pre-processing**: same as somatic — \`MarkDuplicates\` and BQSR.
2.  **Per-sample calling**: \`HaplotypeCaller\` in **GVCF** mode.
3.  **Joint genotyping**: \`GenomicsDBImport\` + \`GenotypeGVCFs\` across the cohort.
4.  **Filtering**: **VQSR** for cohorts (≥ 30 exomes or WGS), hard filters for single samples.

Annotation is not part of the GATK workflow itself; Ensembl VEP is the task-force default.
      `,
      publications: [
        { title: "From FastQ data to high confidence variant calls: the Genome Analysis Toolkit best practices pipeline", authors: "Van der Auwera et al.", journal: "Current Protocols in Bioinformatics", doi: "10.1002/0471250953.bi1110s43", url: "https://doi.org/10.1002/0471250953.bi1110s43" },
        { title: "Scaling accurate genetic variant discovery to tens of thousands of samples", authors: "Poplin et al.", journal: "bioRxiv", doi: "10.1101/201178", url: "https://doi.org/10.1101/201178" },
      ],
      examples: [
        { title: "Germline short variant discovery", desc: "The official GATK germline workflow.", url: "https://gatk.broadinstitute.org/hc/en-us/articles/360035535932-Germline-short-variant-discovery-SNPs-Indels-" },
      ],
    },
  },
  {
    id: "l_sarek_germline",
    name: "nf-core/sarek — Germline DeepVariant (v3.11.0)",
    shortName: "Sarek Germline",
    color: "#0891b2",
    status: "stable",
    scope: "clinical",
    omicsCategory: "DNA",
    technology: "Illumina",
    stops: ["s_input", "s_fastqc", "s_fastp", "s_bwamem2", "s_markdup", "s_deepvariant", "s_manta", "s_vep", "s_multiqc"],
    supportedVariants: ["SNV", "Indel", "SV"],
    wiki: {
      theory: `
A germline setup of nf-core/sarek using **DeepVariant**, which consistently ranks among the most accurate germline callers in public benchmarks.

### Why this route
*   DeepVariant needs **no BQSR and no VQSR**: the neural network is trained to handle quality-score biases itself.
*   Works per sample; cohorts are merged with **GLnexus**.
*   Manta adds germline structural variants.

Run with \`--tools deepvariant,manta,vep\`.
      `,
      publications: [
        { title: "A universal SNP and small-indel variant caller using deep neural networks", authors: "Poplin et al.", journal: "Nature Biotechnology", doi: "10.1038/nbt.4235", url: "https://doi.org/10.1038/nbt.4235" },
        { title: "Manta: rapid detection of structural variants and indels for germline and cancer sequencing applications", authors: "Chen et al.", journal: "Bioinformatics", doi: "10.1093/bioinformatics/btv710", url: "https://doi.org/10.1093/bioinformatics/btv710" },
      ],
      examples: [
        { title: "DeepVariant case studies", desc: "Step-by-step WGS and WES runs with expected accuracy.", url: "https://github.com/google/deepvariant" },
      ],
    },
  },
  {
    id: "l_onco",
    name: "nf-core/oncoanalyser (v3.0.0)",
    shortName: "oncoanalyser",
    color: "#dc2626",
    status: "review",
    scope: "clinical",
    omicsCategory: "DNA",
    technology: "Illumina",
    stops: ["s_input", "s_fastqc", "s_bwamem2", "s_redux", "s_sage", "s_esvee", "s_purple", "s_pave", "s_linx", "s_orange"],
    clinical: {
      specimen: "Fresh-frozen tissue, FFPE",
      minDNA: "Not yet assessed by the task force",
      coverage: "WGS ~100× tumour / ~40× normal (Hartwig standard); targeted panels supported",
      lod: "Not yet assessed by the task force",
      reportableRange: "SNVs, indels, SVs, CNVs, purity/ploidy, MSI, TMB, DNA fusions",
      tat: "Not yet assessed by the task force",
    },
    supportedVariants: ["SNV", "Indel", "CNV", "SV"],
    wiki: {
      theory: `
oncoanalyser is the \`nf-core\` implementation of the **Hartwig Medical Foundation** cancer analysis toolkit (WiGiTS), co-developed with UMCCR. It accepts FASTQ, BAM or CRAM and runs whole-genome / transcriptome (\`wgts\`) or targeted-panel modes.

### Toolchain
*   **Pre-processing**: BWA-MEM2 alignment, \`REDUX\` duplicate marking.
*   **Small variants**: \`SAGE\`, annotated by \`PAVE\`.
*   **Structural variants**: \`ESVEE\`, interpreted by \`LINX\` (fusions, driver disruptions).
*   **Copy number & purity**: \`AMBER\` + \`COBALT\` → \`PURPLE\` (also MSI and TMB).
*   **Report**: \`ORANGE\`.

> The strength of this pipeline is that every caller is purity-aware and the results are checked against each other.
      `,
      publications: [
        { title: "Pan-cancer whole-genome analyses of metastatic solid tumours", authors: "Priestley et al.", journal: "Nature", doi: "10.1038/s41586-019-1689-y", url: "https://doi.org/10.1038/s41586-019-1689-y" },
        NFCORE_PUB,
      ],
      examples: [
        { title: "oncoanalyser documentation", desc: "Modes, samplesheet format and reference data (HMF resource bundle).", url: "https://nf-co.re/oncoanalyser" },
      ],
    },
  },

  /* ── RNA ────────────────────────────────────────── */
  {
    id: "l_rnaseq",
    name: "nf-core/rnaseq (v3.27.0)",
    shortName: "rnaseq",
    color: "#0d9488",
    status: "review",
    scope: "exploratory",
    omicsCategory: "RNA",
    technology: "Illumina",
    stops: ["s_r_fastqc", "s_r_trimgalore", "s_r_star", "s_r_salmon", "s_r_multiqc"],
    supportedVariants: ["Expression"],
    wiki: {
      theory: `
nf-core/rnaseq turns raw RNA-seq reads into gene and transcript count matrices with extensive QC.

### Default route (\`star_salmon\`)
1.  **Trimming**: Trim Galore (fastp optional).
2.  **Alignment**: STAR, splice-aware, against the genome.
3.  **Quantification**: Salmon on STAR's transcriptome alignments; \`tximport\` summarises to gene level.
4.  **QC**: RSeQC, Qualimap, dupRadar, Preseq — all collected by MultiQC.

Alternatives: \`star_rsem\`, HISAT2 (alignment only), or Salmon/Kallisto pseudo-alignment for speed.
      `,
      publications: [
        { title: "STAR: ultrafast universal RNA-seq aligner", authors: "Dobin et al.", journal: "Bioinformatics", doi: "10.1093/bioinformatics/bts635", url: "https://doi.org/10.1093/bioinformatics/bts635" },
        { title: "Salmon provides fast and bias-aware quantification of transcript expression", authors: "Patro et al.", journal: "Nature Methods", doi: "10.1038/nmeth.4197", url: "https://doi.org/10.1038/nmeth.4197" },
        NFCORE_PUB,
      ],
      examples: [
        { title: "nf-core/rnaseq usage", desc: "Samplesheet, strandedness auto-detection and aligner options.", url: "https://nf-co.re/rnaseq" },
      ],
    },
  },
  {
    id: "l_rna_de",
    name: "nf-core/differentialabundance (DESeq2)",
    shortName: "Diff. Expression",
    color: "#7c3aed",
    status: "experimental",
    scope: "exploratory",
    omicsCategory: "RNA",
    technology: "Any",
    stops: ["s_r_salmon", "s_r_deseq2", "s_r_multiqc"],
    supportedVariants: ["Expression"],
    wiki: {
      theory: `
Takes the gene count matrix from nf-core/rnaseq and tests which genes change between conditions.

### Key points
*   **DESeq2** models raw counts with a negative binomial GLM; never feed it TPM.
*   Put known batch effects in the design formula (e.g. \`~ batch + condition\`).
*   Aim for **≥ 3 biological replicates** per group.
*   The pipeline also produces an interactive report and gene-set enrichment (GSEA).
      `,
      publications: [
        { title: "Moderated estimation of fold change and dispersion for RNA-seq data with DESeq2", authors: "Love et al.", journal: "Genome Biology", doi: "10.1186/s13059-014-0550-8", url: "https://doi.org/10.1186/s13059-014-0550-8" },
      ],
      examples: [
        { title: "nf-core/differentialabundance", desc: "Contrasts file format and report options.", url: "https://nf-co.re/differentialabundance" },
      ],
    },
  },
  {
    id: "l_rnafusion",
    name: "nf-core/rnafusion (v4.1.3)",
    shortName: "rnafusion",
    color: "#e11d48",
    status: "review",
    scope: "clinical",
    omicsCategory: "RNA",
    technology: "Illumina",
    stops: ["s_r_fastqc", "s_r_fastp", "s_r_star", "s_r_fusioncatcher", "s_r_arriba", "s_r_starfusion", "s_r_multiqc"],
    supportedVariants: ["RNA Fusion"],
    wiki: {
      theory: `
nf-core/rnafusion detects gene fusions from RNA-seq by running several callers and combining their evidence.

### Callers
*   **Arriba** and **STAR-Fusion** reuse STAR's chimeric alignments.
*   **FusionCatcher** uses its own aligners, giving independent evidence.

Fusions found by more than one caller are the most reliable. FusionInspector can validate candidates and FusionReport merges the results into one report.
      `,
      publications: [
        { title: "Accurate and efficient detection of gene fusions from RNA sequencing data", authors: "Uhrig et al.", journal: "Genome Research", doi: "10.1101/gr.257246.119", url: "https://doi.org/10.1101/gr.257246.119" },
        { title: "Accuracy assessment of fusion transcript detection via read-mapping and de novo fusion transcript assembly-based methods", authors: "Haas et al.", journal: "Genome Biology", doi: "10.1186/s13059-019-1842-9", url: "https://doi.org/10.1186/s13059-019-1842-9" },
      ],
      examples: [
        { title: "nf-core/rnafusion usage", desc: "Building the reference bundle and choosing callers.", url: "https://nf-co.re/rnafusion" },
      ],
    },
  },
];
