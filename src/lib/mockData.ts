import { ClassroomPack, ClassAnalytics, UserProfile } from '../types';

export const mockUsers: UserProfile[] = [
  {
    id: 'staff-prof-sharma',
    name: 'Dr. Rajesh Sharma',
    email: 'r.sharma@kaksha.ac.in',
    role: 'STAFF',
    institution: 'Apex Institute of Technology',
    department: 'Department of Computer Science & AI',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  },
  {
    id: 'student-aryan',
    name: 'Aryan Verma',
    email: 'aryan.v@student.kaksha.ac.in',
    role: 'STUDENT',
    institution: 'Apex Institute of Technology',
    department: 'B.Tech AI & Data Science (Sem 5)',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250',
  },
];

export const demoClassroomPack: ClassroomPack = {
  id: 'pack-cnn-sem5',
  topic: 'Convolutional Neural Networks',
  subject: 'Artificial Intelligence & Machine Learning',
  grade: 'Semester 5',
  duration: 60,
  createdAt: '2026-09-22T09:30:00Z',
  publishedToStudents: true,
  publishedAt: '2026-09-22T10:05:00Z',
  
  researchPack: {
    topic: 'Convolutional Neural Networks (CNNs)',
    summary:
      'Grounded synthesis from 12 authoritative academic resources covering spatial invariance, kernel operations, pooling mechanisms, receptive fields, and feature hierarchy in modern computer vision architectures.',
    stats: {
      articles: 4,
      papers: 3,
      videos: 2,
      university: 2,
      references: 1,
    },
    sources: [
      {
        id: 'src-1',
        title: 'CS231n: Convolutional Neural Networks for Visual Recognition',
        type: 'University Resource',
        url: 'https://cs231n.github.io/convolutional-networks/',
        domain: 'stanford.edu',
        snippet: 'Deep architectural overview of conv layers, pooling, stride, zero-padding, and spatial dimensions calculation: (W - F + 2P)/S + 1.',
        usedIn: ['Concept Explanation', 'Worked Example', 'Worksheet'],
        citationAuthor: 'Stanford Vision and Learning Lab',
      },
      {
        id: 'src-2',
        title: 'MIT 6.S191: Introduction to Deep Computer Vision',
        type: 'University Resource',
        url: 'http://introtodeeplearning.com',
        domain: 'mit.edu',
        snippet: 'Visual explanation of spatial hierarchical representations: edges to textures to object parts and full semantic classes.',
        usedIn: ['Visual Demonstration', 'Teacher Briefing'],
        citationAuthor: 'Amini et al., MIT',
      },
      {
        id: 'src-3',
        title: 'ImageNet Classification with Deep Convolutional Neural Networks',
        type: 'Research Paper',
        url: 'https://proceedings.neurips.cc/paper/2012/file/c399862d3b9d6b76c8436e924a68c45b-Paper.pdf',
        domain: 'neurips.cc',
        snippet: 'Seminal AlexNet paper showing GPU-accelerated ReLU, dropout regularization, and large-scale convolutional hierarchy.',
        usedIn: ['Concept Explanation', 'Challenge Questions'],
        citationAuthor: 'Krizhevsky, Sutskever, Hinton (2012)',
      },
      {
        id: 'src-4',
        title: 'Visualizing and Understanding Convolutional Networks (ECCV)',
        type: 'Research Paper',
        url: 'https://arxiv.org/abs/1311.2901',
        domain: 'arxiv.org',
        snippet: 'Deconvolutional network techniques uncovering what layer filters actually detect at progressive depths.',
        usedIn: ['Visual Demonstration', 'Misconceptions'],
        citationAuthor: 'Zeiler & Fergus (2014)',
      },
      {
        id: 'src-5',
        title: 'Deep Residual Learning for Image Recognition (ResNet)',
        type: 'Research Paper',
        url: 'https://arxiv.org/abs/1512.03385',
        domain: 'arxiv.org',
        snippet: 'Residual connections solving vanishing gradients in deep feedforward convolutional stacks.',
        usedIn: ['Challenge Questions', 'Slide 8'],
        citationAuthor: 'He, Zhang, Ren, Sun (2016)',
      },
      {
        id: 'src-6',
        title: 'How Convolution Works (3Blue1Brown Neural Networks Series)',
        type: 'Video',
        url: 'https://www.3blue1brown.com/lessons/convolutions',
        domain: 'youtube.com / 3blue1brown.com',
        snippet: 'Intuitive geometric demonstration of dot products across kernel matrices sliding across image grid pixels.',
        usedIn: ['Hook', 'Visual Demonstration'],
        citationAuthor: 'Grant Sanderson',
      },
      {
        id: 'src-7',
        title: 'Deep Learning with PyTorch: torch.nn.Conv2d Documentation',
        type: 'Reference Documentation',
        url: 'https://pytorch.org/docs/stable/generated/torch.nn.Conv2d.html',
        domain: 'pytorch.org',
        snippet: 'Formal mathematical formulation of discrete 2D cross-correlation with channel dimensions, dilation, and bias.',
        usedIn: ['Worked Example', 'Quiz'],
        citationAuthor: 'PyTorch Core Dev Team',
      },
      {
        id: 'src-8',
        title: 'A Guide to Convolution Arithmetic for Deep Learning',
        type: 'Educational Article',
        url: 'https://arxiv.org/abs/1603.07285',
        domain: 'arxiv.org',
        snippet: 'Exhaustive visual cheatsheets for transposed convolutions, valid padding, and stride arithmetic.',
        usedIn: ['Worked Example', 'Answer Key'],
        citationAuthor: 'Dumoulin & Visin',
      },
      {
        id: 'src-9',
        title: 'Understanding Convolutions for Edge Detection and Feature Extraction',
        type: 'Educational Article',
        url: 'https://distill.pub/2019/memorization-in-deep-networks/',
        domain: 'distill.pub',
        snippet: 'Sobel and Gaussian kernel matrix demonstrations demonstrating how weights extract horizontal/vertical edges.',
        usedIn: ['Classroom Activity', 'Hook'],
        citationAuthor: 'Distill Research Collective',
      },
      {
        id: 'src-10',
        title: 'Google Cloud Vertex AI: Vision Model Architecture Guidelines',
        type: 'Educational Article',
        url: 'https://cloud.google.com/vertex-ai/docs',
        domain: 'cloud.google.com',
        snippet: 'Practical computational benchmarks comparing parameter scaling in Dense vs Convolutional layers.',
        usedIn: ['Teacher Briefing', 'Discussion'],
        citationAuthor: 'Google Cloud AI Architecture Team',
      },
      {
        id: 'src-11',
        title: 'Max Pooling vs Average Pooling in Spatial Downsampling',
        type: 'Educational Article',
        url: 'https://machinelearningmastery.com/pooling-layers-for-convolutional-neural-networks/',
        domain: 'machinelearningmastery.com',
        snippet: 'Comparative analysis of translational invariance and signal preservation between pooling modes.',
        usedIn: ['Concept Explanation', 'Quiz'],
        citationAuthor: 'Jason Brownlee',
      },
      {
        id: 'src-12',
        title: 'Computer Vision: Algorithms and Applications (2nd Ed)',
        type: 'Educational Article',
        url: 'https://szeliski.org/Book/',
        domain: 'szeliski.org',
        snippet: 'Foundational textbook treatment of linear spatial filtering and multi-resolution pyramids.',
        usedIn: ['Teacher Briefing', 'Exit Ticket'],
        citationAuthor: 'Richard Szeliski',
      },
    ],
  },

  learningObjectives: [
    '1. Define the fundamental mathematical formulation of 2D convolution and distinguish it from dense matrix multiplication.',
    '2. Explain the mechanism and benefits of parameter sharing and spatial local connectivity in reducing model parameters.',
    '3. Calculate output feature map spatial dimensions given input shape, kernel size, stride, and padding.',
    '4. Contrast the functionality of Max Pooling vs Average Pooling for dimensionality reduction and translational invariance.',
    '5. Trace the end-to-end forward pass of a standard CNN pipeline (Input -> Conv -> ReLU -> Pool -> Flatten -> Dense -> Softmax).',
  ],

  lessonTimeline: [
    {
      timeRange: '00–05 min',
      startMin: 0,
      endMin: 5,
      title: 'Classroom Hook: The Billion-Parameter Cat Problem',
      description: 'Engage students with a high-resolution 1080p image and calculate why fully connected layers collapse computationally (6 million weights per single neuron!).',
      activityType: 'Hook',
      teacherGuidance: 'Write on board: 1920 x 1080 x 3 = 6,220,800 inputs. Ask: "If hidden layer has 1,000 neurons, how many weights?" (6.2 Billion!). Introduce CNN as nature’s compression.',
      keyQuestionsToAsk: [
        'Why cannot standard Multi-Layer Perceptrons scale to photographic images?',
        'Does a cat in the top-left corner look fundamentally different to an edge detector than a cat in the bottom-right?',
      ],
    },
    {
      timeRange: '05–15 min',
      startMin: 5,
      endMin: 15,
      title: 'Core Concept: The Kernel, Stride, & Receptive Field',
      description: 'Formalize 2D discrete convolution. Explain sliding dot product, receptive fields, and weight sharing across the spatial grid.',
      activityType: 'Concept',
      teacherGuidance: 'Draw a simple 4x4 input matrix and a 2x2 kernel. Compute the first two output cells step-by-step with student input.',
      keyQuestionsToAsk: [
        'How many distinct parameters are in a 3x3 filter regardless of image resolution? (Only 9 plus bias!)',
        'What is meant by "translation equivariance"?',
      ],
    },
    {
      timeRange: '15–25 min',
      startMin: 15,
      endMin: 25,
      title: 'Visual Demonstration: Sobel Filters & Feature Hierarchies',
      description: 'Demonstrate live how a 3x3 vertical edge detector filter transforms an image of a handwritten digit into boundary gradients.',
      activityType: 'Visual Demonstration',
      teacherGuidance: 'Project visual diagram of Layer 1 (edges/gradients) -> Layer 2 (textures/motifs) -> Layer 3 (object parts: eyes, wheels) -> Layer 4 (full objects).',
      keyQuestionsToAsk: [
        'Why do deeper layers perceive larger contextual objects even though each individual kernel is only 3x3?',
      ],
    },
    {
      timeRange: '25–35 min',
      startMin: 25,
      endMin: 35,
      title: 'Worked Example: Output Dimension Arithmetic',
      description: 'Solve the definitive sizing formula: Output = floor((W - K + 2P) / S) + 1. Walk through zero padding (Valid vs Same) and stride implications.',
      activityType: 'Worked Example',
      teacherGuidance: 'Give input: 32x32x3 image, 5x5 kernel, Stride=1, Padding=2. Guide class to show: (32 - 5 + 2*2)/1 + 1 = 32 (Same size preserved!).',
      keyQuestionsToAsk: [
        'What happens to spatial resolution if stride=2 without padding?',
        'Why is odd kernel size (3x3, 5x5) preferred over even kernel size?',
      ],
    },
    {
      timeRange: '35–45 min',
      startMin: 35,
      endMin: 45,
      title: 'Classroom Activity: The Human Filter Classifier Game',
      description: 'Small groups of 4 students act as Conv Layers: Group 1 detects horizontal strokes, Group 2 detects loops, Group 3 aggregates into digits.',
      activityType: 'Activity',
      teacherGuidance: 'Distribute 4x4 pixel cards. Give 6 minutes to compute convolution sum, 4 minutes for cross-group pooling verification.',
      keyQuestionsToAsk: [
        'Which group found the feature fastest? Why did pooling make your classification robust to shift?',
      ],
    },
    {
      timeRange: '45–52 min',
      startMin: 45,
      endMin: 52,
      title: 'Synthesis & Guided Discussion: Pooling & Regularization',
      description: 'Compare Max Pooling (preserves prominent activations) vs Average Pooling (smooths backgrounds). Address spatial information loss.',
      activityType: 'Discussion',
      teacherGuidance: 'Bridge to modern architectures: Why are modern networks moving towards strided convolutions instead of explicit max pooling?',
      keyQuestionsToAsk: [
        'Does pooling have trainable parameters? (No, fixed non-parametric operation!)',
      ],
    },
    {
      timeRange: '52–57 min',
      startMin: 52,
      endMin: 57,
      title: 'Quick 5-Question Mastery Assessment',
      description: 'Students complete the 5-question Google Form / In-App quiz to evaluate conceptual and arithmetic mastery.',
      activityType: 'Quiz',
      teacherGuidance: 'Instruct students to open student portal or scan Google Form QR link. Set countdown timer for 5 minutes.',
      keyQuestionsToAsk: [],
    },
    {
      timeRange: '57–60 min',
      startMin: 57,
      endMin: 60,
      title: 'Exit Ticket & Wrap-Up',
      description: 'Students submit 1 key takeaway and 1 burning question before leaving. Connect to next lecture on Backpropagation and Optimization.',
      activityType: 'Exit Ticket',
      teacherGuidance: 'Collect digital exit tickets. Announce next lecture: "How gradients flow back through convolutions: Backpropagation in ConvNets".',
      keyQuestionsToAsk: [
        'In one sentence: why does a CNN beat a standard MLP on image data?',
      ],
    },
  ],

  presentation: [
    {
      slideNumber: 1,
      title: 'Convolutional Neural Networks',
      subtitle: 'Spatial Hierarchies & Deep Computer Vision | Semester 5 AI & ML',
      bulletPoints: [
        'Apex Institute of Technology — Department of AI & Data Science',
        'Instructor: Dr. Rajesh Sharma',
        'Session Objective: Transform raw pixel grids into semantic object predictions',
        'Prerequisites: Linear Algebra, Multi-Layer Perceptrons, Gradient Descent',
      ],
      visualPrompt: 'Clean minimalist dark blue gradient slide with high-contrast glowing network icon and university header.',
      presenterNotes: 'Welcome students. State today’s high-stakes goal: by minute 60, every student will be able to calculate Conv dimensions and explain modern vision AI.',
    },
    {
      slideNumber: 2,
      title: 'Today’s Learning Objectives',
      subtitle: 'What you will master by the end of this lecture',
      bulletPoints: [
        'Understand why standard Dense MLPs collapse when processing photographic images',
        'Formulate 2D discrete convolution mathematically and visually',
        'Master the dimension formula: Out = ((W - K + 2P)/S) + 1',
        'Compare Max Pooling vs Average Pooling for translation invariance',
        'Trace the full ConvNet pipeline from raw RGB to classification logits',
      ],
      visualPrompt: '5 numbered target badges with crisp typography and subtle checkmarks.',
      presenterNotes: 'Direct students to notice objective #3 and #5 — these are core exam topics and directly tested on today’s quiz.',
    },
    {
      slideNumber: 3,
      title: 'The Curse of Dimensionality in Images',
      subtitle: 'Why fully connected (Dense) networks fail at visual tasks',
      bulletPoints: [
        'A modest 1920x1080 color image contains 6,220,800 raw input values',
        'Connecting to 1,000 hidden neurons creates 6.2 Billion weight parameters!',
        'Overfitting is virtually guaranteed without billions of training samples',
        'Spatial topology is discarded: pixel (x,y) has no intrinsic relation to neighbor (x+1,y)',
        'Lack of Translation Invariance: An object in top-left is treated as brand new in bottom-right',
      ],
      visualPrompt: 'Split diagram: Left shows flattened image vector losing grid topology; Right shows massive tangle of 6 billion weights.',
      presenterNotes: 'Emphasize that images have local structure: nearby pixels are correlated. Flattening an image throws away the geometry.',
    },
    {
      slideNumber: 4,
      title: 'The Biologically-Inspired Solution: Local Connectivity',
      subtitle: 'Hubel & Wiesel visual cortex discovery (Nobel Prize 1981)',
      bulletPoints: [
        'Biological visual neurons respond only to stimuli in a restricted region: Receptive Field',
        'Local Connectivity: Each neuron in a Conv layer connects ONLY to a local patch of input',
        'Weight Sharing: The EXACT same filter weights slide across the entire visual field',
        'Dramatic parameter reduction: 3x3 filter = 9 parameters, regardless of 100x100 or 4K input!',
        'Translation Equivariance: If an input shifts, the feature map activation shifts identically',
      ],
      visualPrompt: 'Diagram illustrating a small 3x3 kernel sweeping smoothly across a grid of image pixels.',
      presenterNotes: 'Ask the class: if an edge detector works in the sky to find a cloud edge, why wouldn’t it work on the ground to find a road edge? Same filter applies everywhere.',
    },
    {
      slideNumber: 5,
      title: 'Mathematical Anatomy of 2D Convolution',
      subtitle: 'The sliding dot product operation',
      bulletPoints: [
        'Discrete 2D Cross-Correlation Formula: S(i,j) = (I * K)(i,j) = sum_m sum_n I(i+m, j+n) * K(m,n)',
        'Element-wise multiplication between kernel weights and local receptive patch',
        'Sum all element products together and add scalar bias: z = sum(I_patch * K) + b',
        'Pass through non-linear activation: a = ReLU(z) = max(0, z)',
        'Produces one scalar output in the resulting Feature Map',
      ],
      visualPrompt: 'Grid visualization showing 3x3 input patch [1,0,1; 0,1,0; 1,0,1] multiplied by filter weights yielding single output cell.',
      presenterNotes: 'Walk through the arithmetic slowly. Emphasize that technically machine learning libraries perform cross-correlation without flipping the kernel.',
    },
    {
      slideNumber: 6,
      title: 'Controlling Dimensions: Padding & Stride',
      subtitle: 'Preserving boundaries and managing downsampling',
      bulletPoints: [
        'Problem: Convolving without padding shrinks image boundaries and loses edge pixels',
        'Zero Padding (P): Adding border rings of zeros around input matrix',
        'Valid Padding (P=0): No padding applied, spatial dimensions shrink: (W - K + 1)',
        'Same Padding: Choose P = (K - 1) / 2 (for odd K) to maintain exact input dimensions',
        'Stride (S): Step size the filter skips across the input (S=1 step-by-step, S=2 skips one cell)',
      ],
      visualPrompt: 'Comparison matrix of Valid (shrink) vs Same (padded border) with blue outer zero pads.',
      presenterNotes: 'Write down the rule of thumb: always use odd kernels (3x3, 5x5) because they have a unique center pixel!',
    },
    {
      slideNumber: 7,
      title: 'The Golden Sizing Formula',
      subtitle: 'The essential formula every AI engineer must memorize',
      bulletPoints: [
        'Output Width / Height = floor( (W - K + 2P) / S ) + 1',
        'Example: Input = 32x32, Kernel = 5x5, Padding = 2, Stride = 1',
        'Calculation: floor( (32 - 5 + 2(2)) / 1 ) + 1 = (31 / 1) + 1 = 32 (Same size preserved!)',
        'What if Stride = 2, Padding = 0? floor( (32 - 5 + 0)/2 ) + 1 = floor(13.5) + 1 = 14',
        'Depth dimension: Number of output feature maps ALWAYS equals number of filters in the layer!',
      ],
      visualPrompt: 'Highlighted gold formula callout card with step-by-step substitution arrows.',
      presenterNotes: 'Have everyone calculate this on paper right now. Walk down the aisle to inspect their notebook.',
    },
    {
      slideNumber: 8,
      title: 'Pooling Layers: Dimensionality & Invariance',
      subtitle: 'Downsampling feature maps without trainable parameters',
      bulletPoints: [
        'Max Pooling: Selects maximum activation within each window (typically 2x2 with Stride 2)',
        'Average Pooling: Computes arithmetic mean across window (often used in final global pooling)',
        'No Trainable Weights: Completely deterministic, reduces computational load for deeper layers',
        'Translational Invariance: Small shifts in input pixel positions do not alter the pooled maximum',
        '2x2 Max Pool with Stride 2 reduces spatial area by 75% (halves width and height)',
      ],
      visualPrompt: '2x2 Max Pooling visual showing a 4x4 matrix split into 4 colored quadrants, picking the max from each.',
      presenterNotes: 'Clarify common student confusion: Pooling does NOT have weights or biases! It is purely an aggregation function.',
    },
    {
      slideNumber: 9,
      title: 'Feature Hierarchy: Low, Mid, & High-Level Features',
      subtitle: 'How deep networks build conceptual abstractions',
      bulletPoints: [
        'Early Layers (1-2): Simple low-level primitives (directional edges, color blobs, line angles)',
        'Middle Layers (3-5): Textures, corners, repeating motifs, object parts (eyes, wheels, mesh)',
        'Deep Layers (6+): Whole object representations (faces, vehicles, animals)',
        'Effective Receptive Field grows exponentially with depth despite small 3x3 kernels',
        'Visualization methods (Zeiler & Fergus) prove deep representations match human perception',
      ],
      visualPrompt: '3-tier visual pyramid moving upwards from Gabor-like edge filters to complex dog/cat face feature maps.',
      presenterNotes: 'This is the magic of deep learning: you do not write edge detection code. Backpropagation automatically discovers edge detectors.',
    },
    {
      slideNumber: 10,
      title: 'Classroom Activity: Filter Classifier Game',
      subtitle: 'Put CNN principles into live practice in small groups',
      bulletPoints: [
        'Teams of 4: Each team receives a 5x5 binary pixel activation matrix',
        'Group A: Computes 3x3 Horizontal Edge Filter convolved with top half',
        'Group B: Computes 3x3 Vertical Edge Filter convolved with right half',
        'Group C: Executes 2x2 Max Pooling on the intermediate results',
        'Goal: Jointly classify whether the input represents digit "1" or digit "7" in 10 minutes!',
      ],
      visualPrompt: 'Activity instructions card with timer graphic and team breakdown icons.',
      presenterNotes: 'Announce 10-minute countdown. Observe which teams properly handle boundary padding.',
    },
    {
      slideNumber: 11,
      title: 'End-to-End CNN Architecture Pipeline',
      subtitle: 'From photographic pixels to softmax probability distribution',
      bulletPoints: [
        'Stage 1: Feature Extraction Backbone (Conv -> BatchNorm -> ReLU -> MaxPool repeated)',
        'Stage 2: Flattening / Global Average Pooling to collapse 3D tensors into a 1D vector',
        'Stage 3: Fully Connected (Dense) Classification Head with Dropout regularization',
        'Stage 4: Softmax activation outputting normalized probability vector over N target classes',
        'Loss function: Cross-Entropy loss computed against one-hot ground truth label',
      ],
      visualPrompt: 'Complete horizontal architecture pipeline banner showing Input Image -> Conv blocks -> Flatten -> Dense -> Output.',
      presenterNotes: 'Reiterate the dual nature of CNNs: the convolutional front-end is an automatic feature extractor, the dense back-end is a classifier.',
    },
    {
      slideNumber: 12,
      title: 'Common Misconceptions & Traps',
      subtitle: 'Avoid these classic errors on exams and research',
      bulletPoints: [
        'TRAP 1: "More layers always improve CNN accuracy" -> Deeper nets suffer vanishing gradients unless using residual skip-connections (ResNet)!',
        'TRAP 2: "Filters are manually crafted by the engineer" -> Filters start random and are LEARNED entirely via backpropagation!',
        'TRAP 3: "Pooling has trainable weights" -> Pooling is fixed; it has ZERO parameters.',
        'TRAP 4: "Padding increases information" -> Padding only preserves geometry at boundaries, adding no new visual data.',
      ],
      visualPrompt: 'Warning shield icons highlighting 4 common conceptual traps with red X and green checks.',
      presenterNotes: 'Take an extra 3 minutes on Trap 1 and 2. Almost 40% of students in previous semesters missed this on the midterm.',
    },
    {
      slideNumber: 13,
      title: 'Summary & References',
      subtitle: 'Key takeaways and authoritative literature',
      bulletPoints: [
        'Key Takeaway: Local connectivity + weight sharing enables scalable computer vision',
        'Formula: Output = floor( (W - K + 2P)/S ) + 1',
        'Stanford CS231n: Convolutional Networks for Visual Recognition (Fei-Fei Li et al.)',
        'MIT 6.S191 Deep Learning Course (Amini et al.)',
        'Deep Learning Book Chapter 9 (Goodfellow, Bengio, Courville)',
        'Next Lecture: Backpropagation & Gradient Flow through Convolutional Tensors',
      ],
      visualPrompt: 'Clean summary badge list with QR code for lecture notes and complete reading citations.',
      presenterNotes: 'Direct students to open the quiz link in the student portal immediately.',
    },
  ],

  teacherBrief: {
    topicOverview:
      'Convolutional Neural Networks (CNNs) are the foundational architecture for computer vision and grid-like structured data. They replace fully connected matrix multiplications with local discrete 2D convolutions, drastically reducing parameter counts via weight sharing and preserving spatial topological relationships.',
    coreConcepts: [
      'Spatial Invariance & Local Receptive Fields',
      'Weight Sharing across spatial grid coordinates',
      'Discrete 2D Cross-Correlation with multi-channel inputs',
      'Zero Padding (Valid vs Same) and Stride Mechanics',
      'Non-linear activation (ReLU) and Spatial Downsampling (Max Pooling)',
      'Feature Hierarchy Progression (Edges -> Textures -> Parts -> Objects)',
    ],
    importantTerminology: [
      {
        term: 'Kernel / Filter',
        definition: 'A small matrix of trainable weights (e.g. 3x3xChannels) that slides across the input tensor computing local dot products.',
      },
      {
        term: 'Feature Map / Activation Map',
        definition: 'The 2D output matrix resulting from sliding one kernel across the entire spatial area of the input.',
      },
      {
        term: 'Stride',
        definition: 'The discrete pixel distance shifted by the kernel between consecutive receptive field computations.',
      },
      {
        term: 'Padding',
        definition: 'Additional boundary pixels (usually zeros) added around the perimeter of an input tensor to preserve spatial dimensions.',
      },
      {
        term: 'Receptive Field',
        definition: 'The sub-region of the original input image that contributes to the activation of a specific neuron in a deeper layer.',
      },
      {
        term: 'Translation Equivariance',
        definition: 'The property where shifting the input image results in an identically shifted output feature map.',
      },
    ],
    realWorldAnalogies: [
      {
        concept: 'Convolution Operation',
        analogy: 'Flashlight in a pitch-black art gallery',
        explanation:
          'Instead of trying to see the entire massive 100-foot mural all at once with blurred vision (Dense network), you sweep a small focused flashlight beam (Kernel) across one small patch at a time, recording where bright colors appear.',
      },
      {
        concept: 'Max Pooling',
        analogy: 'Headline Newspaper Summary',
        explanation:
          'If a paragraph contains 50 words about a goal scored in a soccer match, you do not need all 50 words to know who scored. You only retain the peak event ("Goal by #10!") and discard the mundane details.',
      },
      {
        concept: 'Feature Hierarchy',
        analogy: 'Learning an Alphabet to Write a Novel',
        explanation:
          'Layer 1 learns individual letter strokes (lines, curves). Layer 2 combines strokes into letters. Layer 3 combines letters into words. Layer 4 combines words into sentences and plot themes.',
      },
    ],
    likelyStudentQuestions: [
      {
        question: 'Why do we almost always use odd-sized filters like 3x3 or 5x5 instead of 2x2 or 4x4?',
        suggestedAnswer:
          'Two main reasons: 1) Odd filters have an exact, unambiguous geometric center pixel (e.g. (1,1) in a 3x3), making symmetric zero padding mathematically clean. 2) Stacking two 3x3 filters covers a 5x5 receptive field with fewer parameters (18 vs 25 weights) and an extra non-linearity.',
      },
      {
        question: 'Does convolution look across all color channels simultaneously?',
        suggestedAnswer:
          'Yes! For an RGB image, a 3x3 filter is actually 3x3x3 in dimensions. It computes the dot product across all 3 channels simultaneously and sums them into a single scalar value per spatial coordinate.',
      },
      {
        question: 'What happens if we forget to use an activation function like ReLU after convolution?',
        suggestedAnswer:
          'Convolution is a linear operation. The composition of multiple linear operations is just one single linear operation! Without ReLU, an 100-layer ConvNet collapses mathematically into a single linear filter.',
      },
    ],
    fiveMinuteRecapScript:
      '"Good morning everyone. Today we cracked why computer vision revolutionized AI: standard MLPs collapse under billions of weights and forget spatial geometry. ConvNets solve this with two brilliant principles: local connectivity and weight sharing. A small 3x3 kernel slides across the image, computing dot products that yield feature maps. We pad with zeros when we want to keep dimensions equal, and we use stride to downsample. Max pooling then preserves the most prominent features while making our predictions robust to slight shifts. Remember the Golden Formula: Output = floor((W - K + 2P)/S) + 1. In your quiz today, pay special attention to whether a layer has trainable weights or not!"',
    pacingTips: [
      'Do not spend more than 5 minutes on the MLP parameter calculation hook — make the 6-billion weight point and move forward.',
      'Spend a full 10 minutes on the worked example arithmetic; students consistently stumble on integer floor division with odd strides.',
      'Ensure the Human Filter game ends promptly at 45 minutes to leave adequate time for the 5-question quiz.',
    ],
  },

  misconceptions: [
    {
      id: 'misc-1',
      belief: 'Adding more layers to a CNN always improves accuracy and performance.',
      clarification:
        'Deeper networks often suffer from vanishing/exploding gradients and optimization degradation where deeper models produce higher training error. Modern architectures require residual skip connections (ResNet) or normalization layers to train past 20-30 layers effectively.',
      suggestedCheckQuestion: 'If a 56-layer plain CNN has worse training accuracy than a 20-layer plain CNN, is it overfitting or suffering from optimization degradation?',
    },
    {
      id: 'misc-2',
      belief: 'Convolutional filter weights are hand-designed mathematical kernels like Sobel or Prewitt filters.',
      clarification:
        'While early 1990s computer vision relied on hand-crafted Sobel edge detectors, modern CNNs initialize filter weights randomly and learn optimal feature detectors autonomously through backpropagation and gradient descent.',
      suggestedCheckQuestion: 'Who designs the numbers inside the 3x3 filter of an AlexNet layer?',
    },
    {
      id: 'misc-3',
      belief: 'Max Pooling layers contain trainable weights and biases that update during backpropagation.',
      clarification:
        'Pooling is a fixed, non-parametric mathematical aggregation (taking maximum or average). It has zero learnable weights and zero biases.',
      suggestedCheckQuestion: 'How many trainable parameters are inside a 2x2 Max Pooling layer with stride 2 operating on 64 channels? (Answer: Exactly 0!)',
    },
    {
      id: 'misc-4',
      belief: 'Padding adds meaningful new information to the edges of the image.',
      clarification:
        'Zero padding introduces neutral border values simply to allow filter centers to reach edge pixels without shrinking spatial dimensions. It adds no semantic information.',
      suggestedCheckQuestion: 'What is the primary motivation for "Same" padding in deep architectures?',
    },
  ],

  classroomActivity: {
    title: 'The Human CNN Filter Classification Game',
    durationMinutes: 10,
    groupSize: 'Groups of 4 students',
    resourcesNeeded: ['Printed 5x5 pixel activation grids', 'Dry erase markers or pens', 'Filter cheat sheets'],
    objective: 'Experience manual discrete 2D cross-correlation and max pooling to understand spatial feature extraction and translation invariance.',
    stepByStepInstructions: [
      'Phase 1 (2 min): Divide into groups of 4. Role 1 is Horizontal Filter, Role 2 is Vertical Filter, Role 3 is ReLU activator, Role 4 is Max Pooler.',
      'Phase 2 (4 min): Group applies their 3x3 filter to the 5x5 grid using Stride 1 and Valid padding (yields a 3x3 intermediate map).',
      'Phase 3 (2 min): Role 3 applies ReLU (zeros out negative sums). Role 4 performs 2x2 Max Pooling with Stride 1.',
      'Phase 4 (2 min): Compare final 2x2 pooled signature against the classification board to predict whether the digit was 1, 7, or 0.',
    ],
    deliverable: 'Completed 3x3 feature map matrix and final 2x2 pooled matrix signed by all 4 team members.',
  },

  worksheet: {
    foundation: {
      tierName: 'Foundation',
      targetAudience: 'Students needing core reinforcement of definitions and basic arithmetic.',
      sectionA_Basic: [
        {
          id: 'f-a1',
          number: 1,
          question: 'Define "Parameter Sharing" in CNNs and explain why it reduces memory consumption.',
          hint: 'Think about using the same 3x3 kernel across every patch rather than separate weights per pixel.',
          spaceForWork: true,
        },
        {
          id: 'f-a2',
          number: 2,
          question: 'State the total number of weights (excluding bias) in a single 3x3 convolutional filter operating on a grayscale (1 channel) image.',
          hint: 'Count the dimensions: 3 rows x 3 columns x 1 channel.',
          spaceForWork: true,
        },
      ],
      sectionB_Conceptual: [
        {
          id: 'f-b1',
          number: 3,
          question: 'Explain the difference between Valid Padding and Same Padding in one sentence each.',
          hint: 'Does the spatial dimension shrink or stay identical?',
          spaceForWork: true,
        },
        {
          id: 'f-b2',
          number: 4,
          question: 'Why does a 2x2 Max Pooling layer with Stride 2 have zero learnable parameters?',
          hint: 'Is there a weight matrix, or is it a deterministic mathematical operation?',
          spaceForWork: true,
        },
      ],
      sectionC_Application: [
        {
          id: 'f-c1',
          number: 5,
          question: 'Given an input image of size 16x16, a filter of size 3x3, Padding = 0, and Stride = 1. Calculate the spatial dimensions of the output feature map.',
          hint: 'Use formula: (W - K + 2P)/S + 1.',
          spaceForWork: true,
        },
      ],
    },

    standard: {
      tierName: 'Standard',
      targetAudience: 'Curriculum-standard difficulty for regular semester examinations.',
      sectionA_Basic: [
        {
          id: 's-a1',
          number: 1,
          question: 'Contrast the parameter complexity of connecting a 200x200x3 color image to 100 dense hidden neurons vs convolving it with thirty-two 3x3x3 filters.',
          hint: 'Dense: 200*200*3*100. Conv: 32 * (3*3*3 + 1).',
          spaceForWork: true,
        },
      ],
      sectionB_Conceptual: [
        {
          id: 's-b1',
          number: 2,
          question: 'Explain how local connectivity and weight sharing enforce translation equivariance in early convolutional layers.',
          hint: 'Consider what happens to the output index when f(x) is shifted by delta.',
          spaceForWork: true,
        },
        {
          id: 's-b2',
          number: 3,
          question: 'Describe how stacking two consecutive 3x3 convolutional layers compares to a single 5x5 convolutional layer in terms of effective receptive field, parameter count, and non-linearity.',
          hint: 'Receptive field is identical (5x5), but compare 2*(3*3)=18 weights vs 25 weights.',
          spaceForWork: true,
        },
      ],
      sectionC_Application: [
        {
          id: 's-c1',
          number: 4,
          question: 'An input tensor of shape 64x64x32 is passed through a convolutional layer with 64 filters of size 5x5, with padding P = 2 and stride S = 2. Compute the exact shape of the output tensor.',
          hint: 'Compute spatial H_out and W_out using the golden formula, and remember the channel depth equals the number of filters.',
          spaceForWork: true,
        },
      ],
      sectionD_Challenge: [
        {
          id: 's-d1',
          number: 5,
          question: 'A 2x2 Max Pooling layer with Stride 2 is applied to the output of question 4. What is the final tensor shape? How many parameters does this pooling layer add?',
          hint: 'Halves height and width. Zero parameters added.',
          spaceForWork: true,
        },
      ],
    },

    challenge: {
      tierName: 'Challenge',
      targetAudience: 'Advanced students aiming for competitive research and deep architectural mastery.',
      sectionA_Basic: [
        {
          id: 'c-a1',
          number: 1,
          question: 'Derive the closed-form mathematical expression for the Effective Receptive Field (ERF) of neuron at layer L composed of arbitrary kernel sizes k_l and strides s_l.',
          hint: 'Use induction: RF_l = RF_{l-1} + (k_l - 1) * prod_{i=1}^{l-1} s_i.',
          spaceForWork: true,
        },
      ],
      sectionB_Conceptual: [
        {
          id: 'c-b1',
          number: 2,
          question: 'Explain why 1x1 convolutions (Network-in-Network / Inception) are utilized for cross-channel parametric pooling and dimensionality reduction without altering spatial resolutions.',
          hint: 'Analyze linear combinations across depth channels followed by non-linear activations.',
          spaceForWork: true,
        },
      ],
      sectionC_Application: [
        {
          id: 'c-c1',
          number: 3,
          question: 'Compute the total FLOPs (Floating Point Operations) required for a single forward pass of a Conv2d layer with input 28x28x64, 128 filters of 3x3, padding 1, stride 1. Assume multiply-accumulate counts as 2 FLOPs.',
          hint: 'FLOPs = 2 * H_out * W_out * (K_h * K_w * C_in) * C_out.',
          spaceForWork: true,
        },
      ],
      sectionD_Challenge: [
        {
          id: 'c-d1',
          number: 4,
          question: 'Formulate the gradient flow equation during backpropagation through a Max Pooling layer. Explain how the argmax mask is stored during the forward pass and why average pooling diffuses gradients differently.',
          hint: 'Gradient flows exclusively to the routing index that achieved the maximum during forward pass.',
          spaceForWork: true,
        },
      ],
    },
  },

  quiz: [
    {
      id: 'q-1',
      questionNumber: 1,
      type: 'Multiple Choice',
      question: 'What is the primary computational advantage of weight sharing in Convolutional Neural Networks compared to Fully Connected layers?',
      options: [
        'A. It eliminates the need for activation functions',
        'B. It drastically reduces the number of learnable parameters by reusing the same kernel across all spatial locations',
        'C. It guarantees that training will converge in exactly one epoch',
        'D. It converts color images into grayscale automatically',
      ],
      correctAnswer: 'B',
      explanation:
        'Weight sharing allows a small kernel (e.g. 3x3) to scan across the entire image. Regardless of image resolution, only the kernel weights and bias need to be learned, reducing parameter count from billions to hundreds.',
      difficulty: 'Easy',
      learningObjective: '1. Understand Parameter Sharing & Local Connectivity',
    },
    {
      id: 'q-2',
      questionNumber: 2,
      type: 'Application-Based',
      question:
        'An input feature map has dimensions 32 × 32 × 3. You apply a convolutional layer with 16 filters of size 5 × 5, with Stride = 1 and Padding = 2. What are the dimensions of the resulting output feature map?',
      options: [
        'A. 28 × 28 × 16',
        'B. 32 × 32 × 16',
        'C. 32 × 32 × 3',
        'D. 16 × 16 × 16',
      ],
      correctAnswer: 'B',
      explanation:
        'Using the sizing formula: Output = floor((W - K + 2P)/S) + 1. Here: floor((32 - 5 + 2(2))/1) + 1 = floor(31/1) + 1 = 32. The number of output channels equals the number of filters (16). Thus, the output shape is 32 × 32 × 16.',
      difficulty: 'Medium',
      learningObjective: '3. Calculate Output Spatial Dimensions with Padding and Stride',
    },
    {
      id: 'q-3',
      questionNumber: 3,
      type: 'Scenario-Based',
      question:
        'A student designs a 20-layer deep convolutional network. In every layer, they place a 2 × 2 Max Pooling layer with Stride 2. What critical problem will occur within the first few layers?',
      options: [
        'A. The network will run out of memory due to billions of pooling weights',
        'B. Spatial dimensions will rapidly collapse to 1 × 1, destroying spatial feature resolution before deep semantic representations can form',
        'C. The weights in the pooling layer will explode to infinity',
        'D. Max pooling will invert the colors of the image',
      ],
      correctAnswer: 'B',
      explanation:
        'Each 2x2 max pool with stride 2 halves height and width. For a 32x32 image: 32 -> 16 -> 8 -> 4 -> 2 -> 1. After just 5 pooling layers, spatial dimensions are 1x1! Pooling must be spaced prudently across deep backbones.',
      difficulty: 'Medium',
      learningObjective: '4. Contrast Max Pooling and Downsampling Mechanics',
    },
    {
      id: 'q-4',
      questionNumber: 4,
      type: 'Multiple Choice',
      question: 'How many learnable parameters (weights and biases) exist inside a standard 2 × 2 Max Pooling layer with Stride = 2 operating on 64 channels?',
      options: [
        'A. 256',
        'B. 64',
        'C. Exactly 0',
        'D. 4',
      ],
      correctAnswer: 'C',
      explanation:
        'Pooling is a fixed, non-parametric mathematical operation that simply takes the maximum value in a window. It has zero learnable weights and zero biases.',
      difficulty: 'Easy',
      learningObjective: '4. Understand Pooling Non-Parametric Properties',
    },
    {
      id: 'q-5',
      questionNumber: 5,
      type: 'Application-Based',
      question:
        'During backpropagation in a CNN, how are gradients transmitted through a 2 × 2 Max Pooling layer?',
      options: [
        'A. The incoming gradient is averaged equally across all 4 input cells',
        'B. The incoming gradient is routed entirely to the single neuron position that produced the maximum during the forward pass, while all other positions receive zero',
        'C. Gradients cannot pass through pooling layers; training must stop',
        'D. The gradient is multiplied by a learnable weight matrix',
      ],
      correctAnswer: 'B',
      explanation:
        'Max pooling acts as a routing switch. During forward propagation, the position of the max activation is saved in a "switch" or "argmax" mask. During backward pass, the gradient flows exclusively to that winning coordinate; non-max cells receive zero gradient.',
      difficulty: 'Hard',
      learningObjective: '5. Understand Gradient Flow & Backpropagation through Conv Layers',
    },
  ],

  answerKey: [
    {
      questionNumber: 1,
      answer: 'B',
      explanation: 'Weight sharing applies the same kernel across all spatial locations, reducing parameter complexity by orders of magnitude.',
    },
    {
      questionNumber: 2,
      answer: 'B',
      explanation: 'Sizing formula: floor((32 - 5 + 4)/1) + 1 = 32. Channel depth equals filter count = 16.',
    },
    {
      questionNumber: 3,
      answer: 'B',
      explanation: 'Excessive pooling collapses spatial resolution geometrically (halving at every step).',
    },
    {
      questionNumber: 4,
      answer: 'C',
      explanation: 'Max pooling is a deterministic mathematical operator with zero learnable weights or biases.',
    },
    {
      questionNumber: 5,
      answer: 'B',
      explanation: 'Gradients route strictly through the argmax coordinate recorded during the forward pass.',
    },
  ],

  exitTicket: {
    prompt: 'Before leaving the classroom, summarize in your own words:',
    diagnosticQuestion: 'Why can two consecutive 3x3 convolutions replace one 5x5 convolution with fewer weights?',
    confidenceCheck: 'Rate your confidence in calculating output feature dimensions (1 = Confused, 5 = Ready for Exam).',
  },

  studentResources: [
    {
      title: 'CNN Architecture Cheat Sheet (Stanford CS231n Summary)',
      type: 'Cheat Sheet',
      description: 'Quick reference card with dimension arithmetic formulas, filter sizing rules, and receptive field equations.',
      url: 'https://cs231n.github.io/convolutional-networks/',
    },
    {
      title: 'Interactive 2D Convolution Visualizer',
      type: 'Visual Diagram',
      description: 'Web-based interactive sandbox showing live dot products and feature maps as you drag kernels over sample digits.',
      url: 'https://adamharley.com/nn_vis/',
    },
    {
      title: 'PyTorch Conv2d Minimal Implementation Notebook',
      type: 'Practice Code',
      description: 'Google Colab notebook with clean PyTorch snippet building a 3-layer CNN on Fashion-MNIST in under 30 lines of code.',
      url: 'https://colab.research.google.com',
    },
    {
      title: 'Deep Learning Book (Chapter 9: Convolutional Networks)',
      type: 'Recommended Reading',
      description: 'Authoritative theoretical chapter by Ian Goodfellow, Yoshua Bengio, and Aaron Courville.',
      url: 'https://www.deeplearningbook.org/contents/convnets.html',
    },
  ],

  googleExports: {
    docsUrl: 'https://docs.google.com/document/d/1KakshaAI-CNN-LessonPlan-DrSharma/edit?usp=sharing',
    slidesUrl: 'https://docs.google.com/presentation/d/1KakshaAI-CNN-PresentationDeck-DrSharma/edit?usp=sharing',
    formsUrl: 'https://docs.google.com/forms/d/e/1FAIpQLScKakshaAI-CNN-MasteryQuiz-Sem5/viewform',
    docsExportId: 'gdoc-cnn-48291',
    slidesExportId: 'gslides-cnn-19283',
    formsExportId: 'gform-cnn-92810',
    exportedAt: '2026-09-22T10:02:00Z',
  },
};

export const mockClassAnalytics: ClassAnalytics = {
  lectureId: 'pack-cnn-sem5',
  totalStudents: 45,
  submissionsCount: 42,
  averageScore: 3.65, // out of 5
  topicMastery: [
    { topicName: 'Foundations & Parameter Sharing', percentage: 91, status: 'Mastered' },
    { topicName: 'Output Dimension Arithmetic', percentage: 78, status: 'Competent' },
    { topicName: 'Pooling & Downsampling', percentage: 64, status: 'Needs Improvement' },
    { topicName: 'Backpropagation & Gradient Routing', percentage: 43, status: 'Critical' },
  ],
  weakestTopic: 'Backpropagation & Gradient Routing (43% mastery)',
  aiInsight:
    '43% of students struggled with Question 5 regarding gradient routing through Max Pooling layers. Most incorrectly assumed gradients are distributed equally like average pooling.',
  recommendedAction:
    'Generate a 10-15 minute targeted revision lesson focusing on "Backpropagation in Convolutional & Pooling Layers" with visual gradient flow diagrams.',
  revisionLessonPrompt:
    'Generate a 15-minute targeted remedial lesson on "Backpropagation and Gradient Routing in CNNs and Pooling Layers" with visual diagrams and worked numerical examples.',
};
