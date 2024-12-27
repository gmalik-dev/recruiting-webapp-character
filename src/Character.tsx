import React, { useState } from "react";
import "./Character.css";
import { ATTRIBUTE_LIST, CLASS_LIST, SKILL_LIST } from "./consts";
import { Attributes } from "./types";

const Character = () => {
  const [attributes, setAttributes] = useState(
    ATTRIBUTE_LIST.map((attribute) => ({
      name: attribute,
      value: 10,
      modifier: 0,
    }))
  );

  const GITHUB_USERNAME = "gmalik-dev";
  const API_URL = `https://recruiting.verylongdomaintotestwith.ca/api/${GITHUB_USERNAME}/character`;

  const saveCharacter = async () => {
    const characterData = {
      attributes,
      skills,
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(characterData),
      });

      if (response.ok) {
        console.log("Character saved successfully!");
      } else {
        console.error("Error saving character:", response.statusText);
      }
    } catch (error) {
      console.error("Error saving character:", error);
    }
  };

  const handleIncrease = (index: number) => {
    const newAttributes = [...attributes];
    newAttributes[index].value += 1;
    newAttributes[index].modifier = Math.floor(
      (newAttributes[index].value - 10) / 2
    );
    setAttributes(newAttributes);
  };

  const handleDecrease = (index: number) => {
    const newAttributes = [...attributes];
    if (newAttributes[index].value > 0) {
      newAttributes[index].value -= 1;
      newAttributes[index].modifier = Math.floor(
        (newAttributes[index].value - 10) / 2
      );
      setAttributes(newAttributes);
    }
  };

  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  const toggleClassDetails = (className: string) => {
    setSelectedClass((prevClass) =>
      prevClass === className ? null : className
    );
  };

  const getAttributeModifier = (attributeName: string): number => {
    const attribute = attributes.find((attr) => attr.name === attributeName);
    return attribute ? attribute.modifier : 0;
  };

  const meetsRequirements = (classAttributes: Attributes): boolean => {
    return Object.entries(classAttributes).every(([attribute, minValue]) => {
      const characterAttribute = attributes.find(
        (attr) => attr.name === attribute
      );
      return characterAttribute && characterAttribute.value >= minValue;
    });
  };

  const [skills, setSkills] = useState(
    SKILL_LIST.map((skill) => ({
      name: skill.name,
      baseValue: 0,
      modifier: skill.attributeModifier,
    }))
  );

  const increaseSkill = (index: number) => {
    const newSkills = [...skills];
    newSkills[index].baseValue += 1;
    setSkills(newSkills);
  };

  // Decrease skill value by 1
  const decreaseSkill = (index: number) => {
    const newSkills = [...skills];
    if (newSkills[index].baseValue > 0) {
      newSkills[index].baseValue -= 1;
      setSkills(newSkills);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Character: 1</h1>
        <div className="skill-check">
          <label htmlFor="skill">Skill:</label>
          <input type="text" id="skill" placeholder="Acrobatics" />
          <label htmlFor="dc">DC:</label>
          <input type="number" id="dc" defaultValue="20" />
          <button>Roll</button>
        </div>
      </div>

      <div className="content">
        <div className="section">
          <h2>Attributes</h2>
          <ul>
            {attributes.map((attribute, index) => (
              <li key={index} className="attribute-item">
                {attribute.name}:{" "}
                <span className="value">{attribute.value}</span> (Modifier:{" "}
                <span className="modifier">{attribute.modifier}</span>)
                <button onClick={() => handleIncrease(index)}>+</button>
                <button onClick={() => handleDecrease(index)}>-</button>
              </li>
            ))}
          </ul>
        </div>

        <div className="section">
          <h2>Classes</h2>
          <ul>
            {Object.entries(CLASS_LIST).map(([className, classAttributes]) => {
              const qualifies = meetsRequirements(
                classAttributes as Attributes
              );
              return (
                <li
                  key={className}
                  className={`class-item ${
                    qualifies ? "meets-requirements" : ""
                  }`}
                >
                  <button
                    onClick={() => toggleClassDetails(className)}
                    className="class-button"
                  >
                    {className}
                  </button>
                </li>
              );
            })}
          </ul>
          {selectedClass && (
            <div className="section">
              <h2>Minimum Requirements for {selectedClass}</h2>
              <ul>
                {Object.entries(CLASS_LIST[selectedClass] as Attributes).map(
                  ([attribute, value]: [keyof Attributes, number]) => (
                    <li key={attribute}>
                      {attribute}: {value}
                    </li>
                  )
                )}
              </ul>
            </div>
          )}
        </div>

        <div className="section">
          <h2>Skills</h2>
          <ul>
            {skills.map((skill, index) => {
              const attributeModifier = getAttributeModifier(skill.modifier);
              const total = skill.baseValue + attributeModifier;

              return (
                <li key={skill.name} className="skill-item">
                  {skill.name}: {skill.baseValue} (Modifier: {skill.modifier}) -
                  Total: {total}
                  <button onClick={() => increaseSkill(index)}>+</button>
                  <button onClick={() => decreaseSkill(index)}>-</button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div className="section">
        <button onClick={saveCharacter}>Save Character</button>
      </div>
    </div>
  );
};

export default Character;
