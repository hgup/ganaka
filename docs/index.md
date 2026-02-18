---
icon: lucide/rocket
---

# Ganaka

_Augmenting Actuarial Reserving with Large Language Models: A Hybrid Workbench Approach to Compliance and Efficiency_

## Chapter 1: Introduction

### 1.1 The Problem Statement

- **The "Black Box" vs. "Spreadsheet Hell":** Actuaries are stuck between efficient but opaque Python scripts (`chainladder`) and transparent but error-prone Excel sheets.
    
- **The Documentation Gap:** ASOP 43 and financial reporting standards require detailed documentation of _judgment_, not just numbers. This is often done manually as an afterthought.
    
- **The Accessibility Barrier:** Powerful Python libraries exist but require coding skills that not all reserving actuaries possess.
    

### 1.2 The Proposed Solution

- **"Reserva":** A dual-interface framework (Library + App) that democratizes access to Pythonic reserving while using LLMs to act as an "audit copilot."
    

### 1.3 Research Objectives

1. To architect a system that decouples actuarial logic from the user interface.
    
2. To evaluate the efficacy of LLMs in drafting ASOP-compliant narratives based on quantitative changes.
    
3. To demonstrate a workflow that increases efficiency without sacrificing transparency.
    

## Chapter 2: Literature Review & Background

### 2.1 Actuarial Reserving Methodologies

- Overview of the Chain Ladder method (Bornhuetter-Ferguson, etc.).
    
- Discuss the `chainladder` Python library (citations to the library authors).
    

### 2.2 Regulatory Frameworks

- **ASOP 43 (Property/Casualty Unpaid Claim Estimates):** Specifically the sections on "Data," "Assumptions," and "Communications."
    
- **ASOP 41 (Actuarial Communications):** The requirement for clear reporting.
    

### 2.3 LLMs in Financial Domains

- Review existing papers on using LLMs for financial reporting, auditing, or explaining structured data (Time-series analysis).
    

## Chapter 3: System Architecture (Methodology)

- _Crucial Section: Use the Repository Architecture diagram here._
    

### 3.1 The "Headless" Core Strategy

- Explain why you separated `actuarial_core` from the Web App and Notebook.
    
- **Justification:** "Separation of Concerns" ensures that the math is identical whether run by a C-suite executive on a dashboard or a data scientist in Jupyter.
    

### 3.2 The T-Stack Implementation

- **Frontend:** React/TypeScript for type safety in financial data.
    
- **Backend:** FastAPI for asynchronous processing of long-running actuarial models.
    
- **Math Layer:** Integration with `pandas` and `chainladder`.
    

### 3.3 The LLM Integration (The Copilot)

- **Prompt Engineering:** How you feed the "Triangle" data to the LLM.
    
    - _Note:_ You aren't feeding 10,000 numbers. You are feeding _summaries_ (e.g., "Age 12-24 factor increased by 15%").
        
- **Context Window Management:** How you ensure the LLM knows about ASOP 43 definitions.
    

## Chapter 4: Implementation & Case Study

### 4.1 The CAS Loss Reserve Database

- Use the **CAS Loss Reserve Database** (a public dataset of real insurance data) as your testing ground.
    
- Do not use random data for the final thesis; use this "gold standard" dataset.
    

### 4.2 Workflow Walkthrough

1. **Ingestion:** Loading a CAS triangle into `Reserva Workbench`.
    
2. **Diagnosis:** The system flagging an outlier in 2021 (e.g., COVID impact).
    
3. **Judgment:** The user manually overriding a link ratio.
    
4. **Drafting:** The LLM auto-generating a note: _"Selected factor deviates from weighted average due to anomalous frequency in 2021..."_
    

## Chapter 5: Evaluation & Discussion

### 5.1 Qualitative Evaluation

- Compare a standard generic output vs. your System's output.
    
- Does the generated text actually sound like an actuary? (e.g., Does it use terms like "development patterns," "tail factors," "adverse deviation" correctly?)
    

### 5.2 Latency and Performance

- How fast can the API recalculate the reserve when a user toggles a button? (Benefits of FastAPI).
    

### 5.3 Limitations

- Hallucination risks: Discuss how you mitigate the LLM making up numbers (e.g., by hard-coding the numbers in the prompt and asking the LLM only to wrap text around them).
    

## Chapter 6: Conclusion

- Summary of contributions.
    
- Future work: Adding stochastic methods (Mack Bootstrap) to the UI, or fine-tuning a small Llama model specifically on actuarial reports.
    

## Appendices

- A. System Architecture Diagram.
    
- B. Sample System Prompt used for the LLM.
    
- C. Code snippets from `actuarial_core`.