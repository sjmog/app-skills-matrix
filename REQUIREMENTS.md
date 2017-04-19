# app-skills-matrix

This application is meant to be an automated approach to the skills matrix system that we use here at TES. See the existing template [here](https://docs.google.com/spreadsheets/d/1OUO5s45mD-ReRPtJp2V65mclMHpUb7iMIuF6tA9f1xI/edit).  An application will allow for better scaling and flexibility across the team as it grows.  Ideally this system will be open-source and be accompanied with some blog posts/documentation to explain how it works.  To this end we should try to avoid any internal closed source technologies like electric-mongo (electrician is fine).  The data here is confidential for each user so some thought has to be put into how to store things in mongo without allowing the curious to check out another users' skills matrix.

## Domain

### Skill

A **skill** represents a demonstratable behaviour from an engineer.  Each **skill** will have a **level** at which we expect the **skill** to be demonstrated.  The **skills** matrix is split based on **categories** which allow us to evaluate specific facets of our engineering skillset.  Skills should also have an **acceptance criteria** which help to provide guidance to the engineer to understand whether they have achieved that skill or not.

### Categories (aka column)

The **categories** and **sub-categories** are generalizations that I have come up with the help split engineering skill into the 3 major skill areas (*technical skill*, *architecture*, *leadership*) that I believe make up an engineer. **Sub-categories** are used to then further subdivide the **categores** such that the **skills** are better defined for that **sub-category**.  For example, *dev-ops skills* vs *frontend skills* allows engineers to focus on different areas of the same **category** *technical skill*.

### Levels

The **levels** are based on a modified [Drefus model](https://en.wikipedia.org/wiki/Dreyfus_model_of_skill_acquisition) and represent progression in each of the **sub-category**.  The **skills** are layed out in such a way that there is a definite progression in several skills, such that if you are missing a **skill** at *novice* you will definitely not be able to demonstrate another **skill** at *experienced beginner*. For example, if you are unable to *evaluate a restful api* you are not going to be able to *design a flexible restful api*.

### Skills matrix

The entirety of the **skills** matrix.  This can be considered at two levels - the first is the **template** which defines all the **skills**, **categories** and **levels** for a given role.  For example, we could have two **templates** at TES, the first would be the **template** for Node JS developers and the other for Drupal developers. If **skills** are **edited** within a **template** they should propagate to all **instances** of the skills matrix and, if the **user** or **mentor** has already evaluated the **skill** or moved to the next **level**, allow the **user** or **mentor** to re-evaluate the **skill**. 

The second level is the **evaluation** of the **skills matrix** for a given **user**.  This is where the **users** or their **mentors** will evaluate each skill and mark it as *attained*, *not-attained*, *feedback*, *objective*.  The access to each **evaluation** should be limited to the **user**, their **mentor** and the **system admin**.

### Evaluation

The process of a **mentor** going through the **skills matrix** and assigning one of the **states** (*attained*, *not-attained*, *feedback*, *objective*) to each **skill** currently in either *feedback* or *not-attained*(default) state.  The general process is to proceed through each **skill** in each **sub-category**.  Then move up to the *experienced beginner* and so on.  Once some of the **skills** in a given **sub-classification** are not marked *demonstrated* the next **level** for that **sub-classification** is not evaluated.  This is somewhat arbitrary as there are some **skills** which are non-blocking and it's possible to continue the evaluation without them. When the **evaluation** can no longer evaluate any skills, the process is complete.

## Roles

### User

The **user** is the person which the **skills metrix** is for.  All **users** will have a **skills matrix** and should be able to select from the **template** when they first log into the system.

**Must have:**

* View **skills matrix**
* View existing evaluation reports

### Mentor

The **mentor** can fill the role of **evaluator** for a **user** assuming they have a **mentorship** relationship defined by the **administrator**.  Additionally the **mentor** view anything that the **user** can view as well.

### Administrator

The **administrator** should be able to manage the **templates** and **users**.  For the time being the **administrator** can be hardcoded to be dmorgantini@gmail.com.

**Must have:** 

* Manage Templates (we can hard-code the two existing templates directly in json)
  * Add/Update/Remove **skill**
    * Move **skills** between **levels**/**sub-classifications** 
    * Rename **skill**
    * Create new **skill**
    * Provide **acceptance criteria**
* Manage user roles (we can use github authentication to create the users  ie: https://github.com/tes/tech-presence/blob/master/src/index.js#L27)
  * Assign/Remove a **user** to **mentor** another **user** (this automatically will grant the **mentor** role to the **user**)
  * Assign/Remove the **evaluator** role for a **user**

**Could Have:**

* Manage Templates
  * Create a new **template**
  * Add/Update/Remove **classification**
  * Add/Update/Remove **sub-classification**
* Manage users
  * Assign/Remove the **adminstrator** role for a **user**

### Evaluator

The **evaluator** role is the role for **users** who can do an **evaluation** for any user in the system.  A **mentor** can also do an **evaluation** for a **user** however they are limited to those **users** with whom they have a mentorship relationship set by an **administrator**.

**Must Have:**

* Evaluation
  * Create evaluation for a **user** (pre-requisite: the user must have logged into the system at least once and selected a template)
  * Evaluate **skill**
    * mark as 'needs work' & add comment
    * mark as 'demonstrated'
    * skip **skill**
  * Return to previous **skill**
  * Add an **evaluation** comment

**Could Have:**

* Share evaluation url with **user**

## Additional Requirements

* Deployed to dokku
* Secure storage of **users** skills matrix (wonder if it should be encrypted at rest)
