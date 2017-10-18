# app-skills-matrix

The skills matrix is a tool designed to help engineers focus on their growth and map out their career.
It provides a clear road map for engineers to progress from junior to senior and beyond.

## Domain

### Skill

A **skill** represents a demonstrable behaviour or ability from an engineer.  
Each **skill** will have a **level** at which we expect the **skill** to be demonstrated.  
The **skills** matrix is split based on **categories** which allow us to evaluate specific facets of our engineering skillset.  
Skills should also have an **acceptance criteria** which help to provide guidance to the engineer to understand whether they have achieved that skill or not.
Skills also have a set of questions which should help an engineer decide whether they have achieved the skill or not.

### Categories (aka column)

The **categories** are generalizations that I have come up with the help split engineering skill into the 3 major skill areas (*technical skill*, *architecture*, *leadership*) that I believe make up an engineer.
**Sub-categories** are used to then further subdivide the **categores** such that the **skills** are better defined for that **sub-category**.  
For example, *dev-ops skills* vs *frontend skills* allows engineers to focus on different areas of the same **category** *technical skill*.
Currently, only **sub-categories** are implemented.

### Levels

The **levels** are based on a modified [Drefus model](https://en.wikipedia.org/wiki/Dreyfus_model_of_skill_acquisition) and represent progression in each of the **sub-category**.
The **skills** are layed out in such a way that there is a definite progression in several skills, such that if you are missing a **skill** at *novice* you will definitely not be able to demonstrate another **skill** at *experienced beginner*.
For example, if you are unable to *evaluate a restful api* you are not going to be able to *design a flexible restful api*.

### Skills matrix

The entirety of the **skills** matrix.
This can be considered at two levels - the first is the **template** which defines all the **skills**, **categories** and **levels** for a given role.
For example, we could have two **templates** at TES, the first would be the **template** for Node JS developers and the other for Drupal developers.
If **skills** are **edited** within a **template** they would not propagate to any existing **evaluations**.

The second level is the **evaluation** of the **skills matrix** for a given **user**.  
This is where the **users** will self-evaluate each skill and mark it as *attained*, *not-attained*, *feedback*, *objective*.  
The access to each **evaluation** should be limited to the **user**, their **mentor** and their **line manager**.

### Evaluation

The process of a **user** going through the **skills matrix** and assigning one of the **states** (*attained*, *not-attained*, *feedback*, *objective*) 
to each **skill** currently in either *feedback*, *objective* or *not-attained*(default) state.  
The general process is to proceed through each **skill** in each **sub-category**.  
Then move up to the *experienced beginner* and so on.  
Once some of the **skills** in a given **sub-classification** are not marked *demonstrated* the next **level** for that **sub-classification** is not evaluated.  
This is somewhat arbitrary as there are some **skills** which are non-blocking and it's possible to continue the evaluation without them. 
When the **evaluation** can no longer evaluate any skills, the process is complete.
