import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';

// Definición de las áreas de evaluación
const areas = [
  'Roof',
  'HVAC',
  'Water Heater',
  'Exterior Doors',
  'Living Room',
  'Dining Room',
  'Kitchen',
  'Hallway 1',  
  'Hallway 2',  
  'Hallway 3',
  'Senior Bathroom',
  'Bathroom 2',
  'Bathroom 3',
  'Senior Bedroom',
  'Bedroom 2',
  'Bedroom 3',
  'Bedroom 4',
  'Bedroom 5',
  'Laundry Room', 
  'Attic',
  'General Plumbing',
  'Electrical In General',
  'Foundation',
  'Important Information',
];

// Definición de submenús y sus opciones
const subMenus = {
  'Living Room': ['Ceiling', 'Walls', 'Floor', 'Subfloor', 'Lights', 'Door', 'Windows'],
  'Dining Room': ['Ceiling', 'Walls', 'Floor', 'Subfloor', 'Lights', 'Door', 'Windows'],
  'Kitchen': ['Ceiling', 'Walls', 'Floor', 'Subfloor', 'Lights', 'Door', 'Kitchen Plumbing', 'Cabinets And Countertop', 'Windows'],
  'Senior Bathroom': ['Ceiling', 'Walls', 'Floor', 'Subfloor', 'Lights', 'Door', 'Shower And More', 'Windows', 'Toilet'],  
  'Laundry Room': ['Ceiling', 'Walls', 'Floor', 'Subfloor', 'Lights', 'Door', 'Laundry Plumbing'],
  'Bathroom 2': ['Ceiling', 'Walls', 'Floor', 'Subfloor', 'Lights', 'Door', 'Shower And More', 'Windows', 'Toilet'],  
  'Bathroom 3': ['Ceiling', 'Walls', 'Floor', 'Subfloor', 'Lights', 'Door', 'Shower And More', 'Windows', 'Toilet'],  
  'Senior Bedroom': ['Ceiling', 'Walls', 'Floor', 'Subfloor', 'Lights', 'Door', 'Windows'],
  'Bedroom 2': ['Ceiling', 'Walls', 'Floor', 'Subfloor', 'Lights', 'Door', 'Windows'],
  'Bedroom 3': ['Ceiling', 'Walls', 'Floor', 'Subfloor', 'Lights', 'Door', 'Windows'],
  'Bedroom 4': ['Ceiling', 'Walls', 'Floor', 'Subfloor', 'Lights', 'Door', 'Windows'],
  'Bedroom 5': ['Ceiling', 'Walls', 'Floor', 'Subfloor', 'Lights', 'Door', 'Windows'],
  'Hallway 1': ['Ceiling', 'Walls', 'Floor', 'Subfloor', 'Lights', 'Door'],  
  'Hallway 2': ['Ceiling', 'Walls', 'Floor', 'Subfloor', 'Lights', 'Door'],  
  'Hallway 3': ['Ceiling', 'Walls', 'Floor', 'Subfloor', 'Lights', 'Door'], 
  'Attic': ['Accessibility', 'Content Level', 'Windows'],
  'Roof': [
    'Age Of Roof',
    'Roof Leak',
    'Roof Need Replace',
    'Multi Layer Allotment',
    'Decking And Rafters',
    'Cornice and Siding',
    'Roof Repair',
    'Gutters And Downspouts'
  ],
  'HVAC': ['HVAC Type', 'HVAC Condition'],
  'Water Heater': ['Water Heater Type', 'Water Heater Condition'],
  'General Plumbing': ['Drain', 'Water Line'],
  'Electrical In General': ['Electrical Box', 'Electrical In The House'],
  'Windows': ['Quantity', 'Type And Conditions'],
  'Exterior Doors': ['Front Side', 'Back Side', 'Right Side', 'Left Side', 'Carport'],
  'Foundation': ['Basement Foundation', 'Slab Foundation', 'Conventional Foundation','Cross Base Foundation'],
  'Important Information': ['Final Observation'],
};

// Opciones de cada submenú
const subMenuOptions = {
  'Ceiling': ['Stains', 'Holes', 'Patch', 'Smooth', 'Textured', 'Active Leak', 'Needs To Be Replaced Or Repaired', 'Drywall', 'Wood Panels', 'Plaster', 'Rotten Wood', 'Need Reframing', 'Settlement Cracks', 'Ceiling Notes'],
  'Laundry Plumbing': ['Drain Does Not Work Properly', 'Hot Water Does Not Reach Properly', 'Cold Water Does Not Work Properly', 'Leak Is Present', 'Washing Machine Box In Good Condition', 'Washing Machine Box Needs To Be Replaced', 'Laundry Plumbing Notes'],
  'Walls': ['Stains', 'Holes', 'Patch', 'Smooth', 'Textured', 'Active Leak', 'Drywall', 'Wood Panels', 'Plaster', 'Rotten Wood', 'Need Reframing', 'Base And Shoe Is In Bad Condition', 'Base And Shoe Is In Good Condition', 'Settlement Cracks', 'Walls Notes'],
  'Floor': [
    'Hardwood',
    'Ceramic',
    'LVP',
    'Vinyl',
    'Concrete',
    'Mud Bed Floor',
    'Subfloor Needs To Be Reconstructed',
    'Others',
    'Carpet',
    'Good Condition',
    'Bad Condition',
    'Cracks And Fractures',
    'Wear And Tear',
    'Uneven Flooring',
    'Stains',
    'Board Separation',
    'Floating Or Loose Sections',
    'Finish Issues',
    'Warping Or Buckling',
    'Floor Notes'
  ],
  'Subfloor': [
    'Moisture And Mold',
    'Rot',
    'Squeaking Or Creaking',
    'Sagging',
    'Delamination Or Separation',
    'Difficulty Holding Nails Or Screws',
    'Lack Of Proper Support',
    'Subfloor Notes'
  ],
  'Lights': [
    'Ceiling Fan',
    'Ceiling Fan With Light Fixtures',
    'Ceiling Light Fixtures',
    'Wall Light Fixtures',
    'Plug Light Fixtures',
    'Work',
    'Don\'t Work',
    'Switch Failure',
    'Burnt-Out Bulb',
    'Loose Electrical Connections',
    'Overheating',
    'Plug Or Cord Issues',
    'Flickering Light',
    'Noise (Buzzing Or Crackling)',
    'Ballast Problems (In Fluorescent Lamps)',
    'Difficulty Keeping The Bulb In Place',
    'Lack Of Stability',
    'Lights Notes'
  ],
  'Door': ['LH', 'RH', '24', '28', '30', '32', '36', 'Broken', 'Good Condition', 'New Door Transition Needed', 'Door Notes'],
  'Windows': ['1', '2', '3', '4', '5', '6', 'Aluminum', 'Wood', 'Iron', 'Vinyl', '1 Damaged', '2 Damaged', '3 Damaged', '4 Damaged', '5 Damaged', '6 Damaged', 'Windows Notes'],
  'Electrical Box': ['Main Electrical Service Panel Is In Good Condition', 'Main Electrical Service Panel Is In Bad Condition', 'Circuit Breaker', 'Fuse Electrical Box', 'Electrical Box Notes'],
  'Electrical In The House': ['Two-Pronged Receptacle', 'Grounded Receptacle', 'Lack Of GFCI Protection In Wet Areas', 'Non-Functioning Switches', 'Short Circuits', 'Loose Or Damaged Outlets', 'Circuit Overloads', 'Electrical In The House Notes'],
  'Drain': ['Drain Works', 'Drain Is Slow', 'Drain Doesn\'t Work', 'Drain Has A Leak', 'Drain Goes To The Land', 'Drain Notes'],
  'Water Line': ['Low Water Pressure', 'Need New Cold Water Line Pipes', 'Need New Hot Water Line Pipes', 'Water Line Has Leaks', 'Water Line Notes'],
  'Condition': ['Extreme Damage', 'Medium Damage', 'Minor Damage', 'Front Side Damage', 'Left Side Damage', 'Right Side Damage', 'Back Side Damage', 'Condition Notes'],
  'Type': ['Wood Siding', 'Vinyl Siding', 'Concrete Siding', 'Brick Siding', 'Stucco Siding', 'Type Notes'],
  'Kitchen Plumbing': ['Need New Cold Water Line Pipes', 'Need New Hot Water Line Pipes', 'Water Line Has Leaks', 'Drain Has Leaks', 'Need A New Faucet', 'Need New Sink Supply Lines', 'Need New Shutoffs', 'Replace kitchen sink','Replace Garbage Disposal', 'Washing Machine Box', 'Dryer Vent', 'Kitchen Plumbing Notes'],
  'Cabinets And Countertop': ['Cabinets And Countertop Notes'],
  'Shower And More': ['1 Grab bar present ','2 Grab bar present ','3 Grab bar present ','There are not Grab bar','Tile', 'Acrylic', 'Bathtub need replace', 'Low Step Shower need replace','There are not Bathtub or Shower Seatin',' Bathtub or Shower Seating present', 'Need Replace Valve', 'Need A New Vanity', 'Need A New Faucet', 'Shower And More Notes'],
  'Accessibility': ['Staircase', 'Entry', 'Accessibility Notes'],
  'Content Level': ['Low', 'Medium', 'High', 'Walkable Attic', 'Non-Walkable Attic', 'Root Wood', 'Content Level Notes'],
  'Roof': { 
    'Age Of Roof': ['New', '5 Years', '7 Years', '10 Years', '15 Years', '20 Years', 'More 25 Years'],
    'Roof Leak': ['Yes', 'No'],
    'Roof Need Replace': ['Yes', 'No'],
    'Multi Layer Allotment': ['1', '2', '3'],
    'Decking And Rafters': ['Extreme Damage', 'Medium Damage', 'Minor Damage', 'Front Side Damage', 'Left Side Damage', 'Right Side Damage', 'Back Side Damage', 'Decking And Rafters Notes'],
    'Cornice and Siding': [
      'Extreme Front Side Cornice Damage', 'Extreme Front Side Siding Damage', 'Medium Front Side Cornice Damage', 
      'Medium Front Side Siding Damage', 'Small Front Side Cornice Damage', 'Small Front Side Siding Damage', 
      'Extreme Left Side Cornice Damage', 'Extreme Left Side Siding Damage', 'Medium Left Side Cornice Damage', 
      'Medium Left Side Siding Damage', 'Small Left Side Cornice Damage', 'Small Left Side Siding Damage', 
      'Extreme Right Side Cornice Damage', 'Extreme Right Side Siding Damage', 'Medium Right Side Cornice Damage', 
      'Medium Right Side Siding Damage', 'Small Right Side Cornice Damage', 'Small Right Side Siding Damage', 
      'Extreme Back Side Cornice Damage', 'Extreme Back Side Siding Damage', 'Medium Back Side Cornice Damage', 
      'Medium Back Side Siding Damage', 'Small Back Side Cornice Damage', 'Small Back Side Siding Damage', 
      'Cornice and Siding Notes' // Casilla de texto agregada
    ],
    'Roof Repair': ['Roof Repair Notes'],
    'Gutters And Downspouts': ['Gutters And Downspouts Notes']
  },
  'Final Observation': ['Final Observation Notes'],
  'HVAC Type': [
    'Gas', 
    'Electrical', 
    'Central HVAC', 
    'Only Central Furnace', 
    'Only Central AC', 
    'AC Windows', 
    'Wall Heater', 
    'Floor Heater', 
    'Duct Work Only For Heater', 
    'Duct Work For HVAC', 
    'HVAC Type Notes'
  ],
  'HVAC Condition': [
    'Functional', 
    'Non-Functional', 
    'Leak', 
    'Drain Pipe', 
    'Drain Pan', 
    'Pipe Vent Is Defective', 
    'Pipe Vent Is Correct',
    'Dirty Or Blocked Air Filters',
    'Refrigerant Leaks',
    'Thermostat Issues',
    'Drainage Problems',
    'Fan Motor Failures',
    'Loose Or Damaged Ventilation Ducts',
    'Compressor Problems',
    'Electrical Issues',
    'Outdoor Unit Problems',
    'Duct Leaks',
    'HVAC Condition Notes'
  ],
  'Water Heater Type': ['Gas', 'Electrical', 'Tankless Water Heater Electric', 'Tankless Water Heater Gas', '30G', '40G', '50G', '60G', '90G', 'Water Heater Type Notes'],
  'Water Heater Condition': ['Functional', 'Non-Functional', 'Leak', 'Drain Pipe', 'Drain Pan', 'Pipe Vent Is Defective', 'Pipe Vent Is Correct', 'Water Heater Condition Notes'],
  'Exterior Doors': { 
    'Front Side': [
      'Main Door Needs Replace',
      'Security Door Needs Replace',
      'Main Door Is In Good Condition',
      'Security Door Is In Good Condition',
      'Reconstruction Of The Door Frames Framing Is Required',
      'New Door Transition Needed',
      'Entry Is French Door',
      'The Security Door Is Double',
      'Warping',
      'Drafts Or Air Leaks',
      'Sticking Or Difficulty Opening/Closing',
      'Cracks Or Splits In The Door Material',
      'Damage From Insects Or Rot',
      'Broken Or Non-Functional Locks',
      'Broken Or Non-Functional Hinges',
      'Front Side Notes'
    ],
    'Back Side': [
      'Main Door Needs Replace',
      'Security Door Needs Replace',
      'Main Door Is In Good Condition',
      'Security Door Is In Good Condition',
      'Reconstruction Of The Door Frames Framing Is Required',
      'New Door Transition Needed',
      'Entry Is French Door',
      'The Security Door Is Double',
      'Warping',
      'Drafts Or Air Leaks',
      'Sticking Or Difficulty Opening/Closing',
      'Cracks Or Splits In The Door Material',
      'Damage From Insects Or Rot',
      'Broken Or Non-Functional Locks',
      'Broken Or Non-Functional Hinges',
      'Back Side Notes'
    ],
    'Right Side': [
      'Main Door Needs Replace',
      'Security Door Needs Replace',
      'Main Door Is In Good Condition',
      'Security Door Is In Good Condition',
      'Reconstruction Of The Door Frames Framing Is Required',
      'New Door Transition Needed',
      'Entry Is French Door',
      'The Security Door Is Double',
      'Warping',
      'Drafts Or Air Leaks',
      'Sticking Or Difficulty Opening/Closing',
      'Cracks Or Splits In The Door Material',
      'Damage From Insects Or Rot',
      'Broken Or Non-Functional Locks',
      'Broken Or Non-Functional Hinges',
      'Right Side Notes'
    ],
    'Left Side': [
      'Main Door Needs Replace',
      'Security Door Needs Replace',
      'Main Door Is In Good Condition',
      'Security Door Is In Good Condition',
      'Reconstruction Of The Door Frames Framing Is Required',
      'New Door Transition Needed',
      'Entry Is French Door',
      'The Security Door Is Double',
      'Warping',
      'Drafts Or Air Leaks',
      'Sticking Or Difficulty Opening/Closing',
      'Cracks Or Splits In The Door Material',
      'Damage From Insects Or Rot',
      'Broken Or Non-Functional Locks',
      'Broken Or Non-Functional Hinges',
      'Left Side Notes'
    ],
    'Carport': [
      'Main Door Needs Replace',
      'Security Door Needs Replace',
      'Main Door Is In Good Condition',
      'Security Door Is In Good Condition',
      'Reconstruction Of The Door Frames Framing Is Required',
      'New Door Transition Needed',
      'Entry Is French Door',
      'The Security Door Is Double',
      'Warping',
      'Drafts Or Air Leaks',
      'Sticking Or Difficulty Opening/Closing',
      'Cracks Or Splits In The Door Material',
      'Damage From Insects Or Rot',
      'Broken Or Non-Functional Locks',
      'Broken Or Non-Functional Hinges',
      'Carport Notes'
    ]
  },
  'Toilet': ['Round Toilet', 'Elongated Toilet', 'Need Replace', 'No Need Replace', 'Height Chair Toilet', 'Regular Chair Toilet', 'Toilet Notes'],
  'Basement Foundation': [
    'Settlement And Cracking',
    'Foundation Tilting Or Shifting',
    'Moisture And Leakage',
    'Soil Expansion And Contraction',
    'Drainage Issues',
    'Invasive Tree Roots',
    'Construction Issues',
    'Failure Of Pier And Beam Supports',
    'Flooding And Water Damage',
    'Footing Problems',
    'Basement Foundation Notes'
  ],
  'Slab Foundation': [
    'Settlement And Cracking',
    'Foundation Tilting Or Shifting',
    'Moisture And Leakage',
    'Soil Expansion And Contraction',
    'Drainage Issues',
    'Invasive Tree Roots',
    'Construction Issues',
    'Failure Of Pier And Beam Supports',
    'Flooding And Water Damage',
    'Footing Problems',
    'Slab Foundation Notes'
  ],
  'Conventional Foundation': [
    'Settlement And Cracking',
    'Foundation Tilting Or Shifting',
    'Moisture And Leakage',
    'Soil Expansion And Contraction',
    'Drainage Issues',
    'Invasive Tree Roots',
    'Construction Issues',
    'Failure Of Pier And Beam Supports',
    'Flooding And Water Damage',
    'Footing Problems',
    'Conventional Foundation Notes'
  ],'Cross Base Foundation': [
    'Settlement And Cracking',
    'Foundation Tilting Or Shifting',
    'Moisture And Leakage',
    'Soil Expansion And Contraction',
    'Drainage Issues',
    'Invasive Tree Roots',
    'Construction Issues',
    'Failure Of Pier And Beam Supports',
    'Flooding And Water Damage',
    'Footing Problems',
    'Cross Base Foundation Notes' // Agregando la casilla de texto para notas
],

};

// Campos de información general
const generalInfoFields = [
  'Property Address',
  'Homeowner Name',
  'Project Manager',
  'Assessment By',
  'Date Of Assessment',
  'People In House',
  'Pets In Home',
  'Medical Equipment',
  'Mobility Devices',
  'Main Entry',
  'Gutters And Downspouts',
  'Handrails',
  'Ramp',
  'Porch/Step/Walkway Repair',
  'Other Door(s)',
  'Content Level',
  'Exterior Lighting',
  'Pest Treatment',
  'Misc. Exterior Work',
  'Misc. Interior',
  'CO & Smoke Detector',
  'Misc. Energy Efficiency',
  'Total Windows repair', 
  'Total Windows'
];

// Componente principal de la aplicación
function App() {
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedSubArea, setSelectedSubArea] = useState(null);
  const [evaluationData, setEvaluationData] = useState(() => {
    const savedData = localStorage.getItem('evaluationData');
    return savedData ? JSON.parse(savedData) : {};
  });
  const [generalInfo, setGeneralInfo] = useState(() => {
    const savedInfo = localStorage.getItem('generalInfo');
    return savedInfo ? JSON.parse(savedInfo) : {};
  });

  // Añadir fecha automática para Date Of Assessment
  useEffect(() => {
    const today = new Date();
    const formattedDate = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`; // MM/DD/YYYY
    setGeneralInfo((prevInfo) => ({
      ...prevInfo,
      'Date Of Assessment': formattedDate,
    }));
  }, []);

  // Guardar los datos en localStorage cada vez que cambian
  useEffect(() => {
    localStorage.setItem('evaluationData', JSON.stringify(evaluationData));
  }, [evaluationData]);

  useEffect(() => {
    localStorage.setItem('generalInfo', JSON.stringify(generalInfo));
  }, [generalInfo]);

  // Manejar cambios en la información general
  const handleGeneralInfoChange = (field, value) => {
    setGeneralInfo((prevInfo) => ({
      ...prevInfo,
      [field]: value,
    }));
  };

  // Manejar cambios en las opciones de checkbox
  const handleCheckboxChange = (area, subArea, option) => {
    setEvaluationData((prevData) => ({
      ...prevData,
      [area]: {
        ...prevData[area],
        [subArea]: {
          ...prevData[area]?.[subArea],
          [option]: !prevData[area]?.[subArea]?.[option],
        },
      },
    }));
  };

  // Manejar cambios en las opciones de texto
  const handleTextChange = (area, subArea, value) => {
    setEvaluationData((prevData) => ({
      ...prevData,
      [area]: {
        ...prevData[area],
        [subArea]: {
          ...prevData[area]?.[subArea],
          [`${subArea} Notes`]: value,
        },
      },
    }));
  };

  // Capturar una foto usando la cámara trasera
  const handlePhotoCapture = async (area, subArea, option) => {
    const address = generalInfo['Property Address'] || 'Unknown_Address';
    const fileName = `${address}_${area}_${subArea}_${option}.jpg`;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: { exact: "environment" } } // Usar la cámara trasera
      });
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();

      const captureButton = document.createElement('button');
      captureButton.textContent = 'Capture Photo';
      document.body.appendChild(video);
      document.body.appendChild(captureButton);

      captureButton.addEventListener('click', () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          a.click();
          URL.revokeObjectURL(url);

          stream.getTracks().forEach(track => track.stop());
          document.body.removeChild(video);
          document.body.removeChild(captureButton);
        });
      });
    } catch (error) {
      console.error('Error Accessing The Camera:', error);
    }
  };

  // Dibujar un checkbox en el PDF
  const drawCheckbox = (doc, x, y) => {
    doc.setFont('zapfdingbats', 'normal');
    doc.text('4', x, y);
    doc.setFont('helvetica', 'normal');
  };

  // Generar el PDF del resumen
  // Función para generar el PDF del resumen
// Función para generar el PDF del resumen
// Función para guardar la evaluación en un archivo JSON
const saveEvaluationToFile = () => {
  const address = generalInfo['Property Address'] || 'Unknown_Address';
  const evaluation = {
    generalInfo,
    evaluationData
  };
  const jsonData = JSON.stringify(evaluation, null, 2);
  const fileName = `${address.replace(/\s+/g, '_')}_evaluation.json`;
  const blob = new Blob([jsonData], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
};



const generatePDF = () => {
  const doc = new jsPDF();
  const titleFontSize = 16;
  const sectionFontSize = 14;
  const normalFontSize = 12;
  const lineHeight = 8;
  const maxWidth = 180;
  let yOffset = 20;

  // Encabezado del PDF
  doc.setFontSize(titleFontSize);
  doc.setFont('helvetica', 'bold');
  doc.text(`Home Assessment Toolkit Summary`, 105, yOffset, { align: 'center' });
  yOffset += lineHeight * 2;

  // Añadir información general del proyecto en el encabezado
  doc.setFontSize(normalFontSize);
  doc.setFont('helvetica', 'normal');
  doc.text(`Project: ${generalInfo['Project Manager'] || 'N/A'}`, 10, yOffset);
  doc.text(`Date: ${generalInfo['Date Of Assessment'] || 'N/A'}`, 150, yOffset);
  yOffset += lineHeight * 2;

  // Definir el orden de los campos para el resumen del toolkit
  const toolkitSummaryOrder = [
    'Property Address',
    'Homeowner Name',
    'Pets In Home',
    'Date Of Assessment',
    'Project Manager',
    'People In House',
    'Content Level',
    'Assessment By',
    'Mobility Devices',
    'Medical Equipment',
    'Roof',
    'Main Entry',
    'Exterior Doors',
    'Handrails',
    'Porch/Step/Walkway Repair',
    'Foundation',
    'Exterior Lighting',
    'Pest Treatment',
    'Misc. Exterior Work',
    'Senior Bathroom',
    'Bathroom 2',
    'Bathroom 3',
    'Senior Bedroom',
    'Kitchen',
    'CO & Smoke Detector',
    'Living Room',
    'Dining Room',
    'Hallway 1',
    'Hallway 2',
    'Hallway 3',
    'Bedroom 2',
    'Bedroom 3',
    'Bedroom 4',
    'Bedroom 5',
    'Misc. Interior',
    'HVAC',
    'Water Heater',
    'Attic',
    'General Plumbing',
    'Electrical In General',
    'Total Windows',
    'Total Windows repair',
    'Misc. Energy Efficiency'
  ];

  // Añadir contenido de cada campo
  toolkitSummaryOrder.forEach((field) => {
    if (yOffset > 280) { 
      doc.addPage();
      yOffset = 20;
    }

    // Título de la sección
    doc.setFontSize(sectionFontSize);
    doc.setFont('helvetica', 'bold');
    doc.text(field, 10, yOffset);
    yOffset += lineHeight;

    // Línea divisoria
    doc.setDrawColor(0, 0, 0); // Negro
    doc.setLineWidth(0.5);
    doc.line(10, yOffset, 200, yOffset);
    yOffset += lineHeight;

    // Contenido de la sección
    if (field in evaluationData) {
      subMenus[field]?.forEach((subArea) => {
        if (yOffset > 280) { 
          doc.addPage();
          yOffset = 20;
        }

        // Subtítulo de subárea
        doc.setFontSize(normalFontSize);
        doc.setFont('helvetica', 'bold');
        doc.text(`${subArea}:`, 20, yOffset);
        yOffset += lineHeight;

        // Opciones seleccionadas de la subárea
        const options = subMenuOptions[field]?.[subArea] || subMenuOptions[subArea];
        options?.forEach((option) => {
          if (evaluationData[field]?.[subArea]?.[option]) {
            if (yOffset > 280) { 
              doc.addPage();
              yOffset = 20;
            }
            const optionText = `${option}`;
            doc.setFont('helvetica', 'normal');
            doc.text(optionText, 30, yOffset);
            const textWidth = doc.getTextWidth(optionText);
            drawCheckbox(doc, 30 + textWidth + 2, yOffset);
            yOffset += lineHeight;
          }
        });

        // Notas de la subárea
        if (evaluationData[field]?.[subArea]?.[`${subArea} Notes`]) {
          if (yOffset > 280) { 
            doc.addPage();
            yOffset = 20;
          }
          const notesText = `${subArea} Notes: ${evaluationData[field][subArea][`${subArea} Notes`]}`;
          const splitNotesText = doc.splitTextToSize(notesText, maxWidth);
          doc.setFont('helvetica', 'italic');
          splitNotesText.forEach((line) => {
            doc.text(line, 30, yOffset);
            yOffset += lineHeight;
          });
        }
      });
    } else if (generalInfo[field]) {
      const text = `${field}: ${generalInfo[field] || ''}`;
      const splitText = doc.splitTextToSize(text, maxWidth);
      doc.setFont('helvetica', 'normal');
      splitText.forEach((line) => {
        doc.text(line, 10, yOffset);
        yOffset += lineHeight;
      });
    }

    // Espacio entre secciones
    yOffset += lineHeight;
  });

  // Pie de página con número de página
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(`Page ${i} of ${pageCount}`, 200, 290, { align: 'right' });
  }

  // Definir el nombre del archivo
  const address = generalInfo['Property Address'] || 'Unknown_Address';
  const fileName = `${address.replace(/\s+/g, '_')}_Toolkit_Summary.pdf`;

  // Guardar el PDF
  doc.save(fileName);
};




  // Renderizar el resumen
  const renderSummary = () => {
    return (
      <div>
        <h2>General Summary</h2>
        <div>
          <h3>General Information</h3>
          {generalInfoFields.map(field => (
            <div key={field}>
              <strong>{field}: </strong>
              <span>{generalInfo[field]}</span>
            </div>
          ))}
        </div>
        {Object.keys(evaluationData).map(area => (
          <div key={area}>
            <h3>{area}</h3>
            {subMenus[area]?.map(subArea => (
              <div key={subArea}>
                <strong>{subArea}:</strong>
                {(subMenuOptions[area]?.[subArea] || subMenuOptions[subArea])?.map(option => (
                  evaluationData[area]?.[subArea]?.[option] && (
                    <span key={option}>
                      {option} &#x2611;{' '}
                    </span>
                  )
                ))}
                {evaluationData[area]?.[subArea]?.[`${subArea} Notes`] && (
                  <div>
                    <strong>{`${subArea} Notes`}:</strong>
                    <span>{evaluationData[area][subArea][`${subArea} Notes`]}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  // Función para limpiar los datos con confirmación
const handleClearData = () => {
  const confirmed = window.confirm('Are you sure you want to clear all data?'); // Pregunta de confirmación
  if (confirmed) {
    localStorage.removeItem('evaluationData');
    localStorage.removeItem('generalInfo');
    setEvaluationData({});
    setGeneralInfo({});
  }
};

  return (
    <div style={{ paddingLeft: '10px' }}>
      <h1>Home Assessment</h1>
      <div>
        <h2>General Information</h2>
        {generalInfoFields.map(field => (
          <div key={field} style={{ marginBottom: '10px' }}> 
            <label style={{ fontSize: '16px', fontWeight: 'bold' }}>{field}:</label>
            <input
              type="text"
              value={generalInfo[field] || ''}
              onChange={(e) => handleGeneralInfoChange(field, e.target.value)}
              style={{ fontSize: '16px', width: '300px', height: '30px', padding: '5px', marginLeft: '10px' }} 
            />
            {/* Cambiando el tamaño de la casilla de texto */}
          </div>
        ))}
      </div>

      <div>
        <h2>Evaluation Areas</h2>
        <div>
          {areas.map(area => {
            // Definir el estilo basado en el nombre del área
            let buttonStyle = {
              fontSize: '20px', // Aumentar el tamaño del texto
              padding: '10px 20px', // Aumentar el tamaño del botón
              margin: '5px', // Añadir espacio entre botones
            };

            // Condicional para cambiar el color del botón según el nombre del área
            if (['HVAC', 'Roof', 'Water Heater'].includes(area)) {
              buttonStyle.backgroundColor = 'blue';
              buttonStyle.color = 'white';
            } else if (['Siding', 'Attic', 'Foundation'].includes(area)) {
              buttonStyle.backgroundColor = 'green';
              buttonStyle.color = 'white';
            } else if (area.includes('Bedroom')) {
              buttonStyle.backgroundColor = 'orange';
              buttonStyle.color = 'white';
            } else if (area.includes('Bathroom')) {
              buttonStyle.backgroundColor = 'gray';
              buttonStyle.color = 'white';
            }

            return (
              <button 
                key={area} 
                onClick={() => setSelectedArea(area)} 
                style={buttonStyle} // Aplicar el estilo condicional
              >
                {area}
              </button>
            );
          })}
        </div>

        {selectedArea && (
          <div>
            <h3>{selectedArea}</h3>
            <div>
              {subMenus[selectedArea]?.map(subArea => (
                <button 
                  key={subArea} 
                  onClick={() => setSelectedSubArea(subArea)}
                  style={{
                    fontSize: '18px', // Ajustar el tamaño de los submenús
                    padding: '8px 16px', // Aumentar el tamaño de los botones de submenús
                    margin: '5px',
                  }}
                >
                  {subArea}
                </button>
              ))}
            </div>

            {selectedSubArea && (
              <div>
                <h4>{selectedSubArea}</h4>
                <div>
                  {(subMenuOptions[selectedArea]?.[selectedSubArea] || subMenuOptions[selectedSubArea] || []).map(option => (
                    <div key={option} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                      <label style={{ marginRight: '8px' }}>{option}</label>
                      {option === `${selectedSubArea} Notes` ? (
                        <textarea
                          value={evaluationData[selectedArea]?.[selectedSubArea]?.[option] || ''}
                          onChange={(e) => handleTextChange(selectedArea, selectedSubArea, e.target.value)}
                        />
                      ) : (
                        <input
                          type="checkbox"
                          checked={evaluationData[selectedArea]?.[selectedSubArea]?.[option] || false}
                          onChange={() => handleCheckboxChange(selectedArea, selectedSubArea, option)}
                        />
                      )}
                      <button
                        onClick={() => handlePhotoCapture(selectedArea, selectedSubArea, option)}
                        style={{ marginLeft: '8px' }}
                      >
                        📷
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div>
        {renderSummary()}
        <button onClick={saveEvaluationToFile}>Save Evaluation Data</button>

        
        
        <button onClick={() => generatePDF('Toolkit')}>Generate Toolkit PDF</button>
        <button onClick={handleClearData}>Clear Data</button>
      </div>
    </div>
  );
}

export default App;
