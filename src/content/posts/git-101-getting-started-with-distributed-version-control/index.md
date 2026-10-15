---
title: "Git 101: Getting Started with Distributed Version Control"
description: "Git is a distributed version control system commonly used for tracking changes in source code during software development. It allows multiple developers to work on the same project simultaneously and…"
pubDate: 2023-05-30
updatedDate: 2023-11-26
author: "Lakhan Adewar"
tags: ["git", "version-control", "gihub", "version-control-system"]
heroImage: "./image-1.png"
heroAlt: ""
canonicalURL: "https://medium.com/@lakhanadewar/it-101-getting-started-with-distributed-version-control-15e6a6ddc1c9"
originalURL: "https://medium.com/@lakhanadewar/it-101-getting-started-with-distributed-version-control-15e6a6ddc1c9"
---

Git is a distributed version control system commonly used for tracking changes in source code during software development. It allows multiple developers to work on the same project simultaneously and efficiently manage different versions of files. Here are some key features and terms associated with Git:

1.  Repository: A repository, or “repo” for short, is a collection of files and their revision history. It can be either local (on your computer) or remote (on a server).
2.  Clone: Cloning a repository creates a copy of the entire repository on your local machine, including all its files, commit history, and branches.

Example: To clone a repository from a remote server, you would use the following command:

```
git clone 
```

3\. Commit: A commit represents a snapshot of the repository at a specific point in time. It records the changes made to files and includes a commit message explaining the changes.

Example: To commit changes to your repository, you would use the following commands:

```
git add      // Stage the changes
git commit -m "Commit message"   // Commit the changes with a message
```

4\. Branch: A branch is a separate line of development within a repository. It allows you to work on new features or bug fixes without disturbing the main codebase.

Example: To create a new branch named “feature-branch,” you would use the following command:

```
git branch feature-branch
```

5\. Merge: Merging combines changes from one branch into another. It integrates the changes made in the source branch into the target branch.

Example: To merge changes from the “feature-branch” into the “main” branch, you would use the following commands:

```
git checkout main       // Switch to the target branch
git merge feature-branch    // Merge the changes from the source branch
```

6\. Pull: Pulling is the process of fetching the latest changes from a remote repository and merging them into the current branch.

Example: To pull the latest changes from the remote repository into your local branch, you would use the following command:

```
git pull origin 
```

7\. Push: Pushing refers to uploading local commits to a remote repository, allowing others to access and synchronize their work.

Example: To add a remote named “origin” pointing to a remote repository URL, you would use the following command:

```
git remote add origin 
```

Example: To push your local commits to the remote repository, you would use the following command:

```
git push origin 
```

8\. Remote: A remote is a version of the repository stored on a different server. It allows you to collaborate with others by sharing your changes and syncing with their work.

Example: To add a remote named “origin” pointing to a remote repository URL, you would use the following command:

```
git remote add origin 
```

9\. Remote Tracking Branches: Remote tracking branches are local references to the state of branches in a remote repository. They allow you to see and interact with the branches in the remote repository.

Example: After cloning a repository, you would have remote tracking branches set up automatically. To update your remote tracking branches with the latest changes from the remote repository, you can use the following command:

```
git fetch
```

10\. Fetch: The git fetch command retrieves the latest changes from a remote repository without merging them into your current branch. It updates your remote tracking branches, allowing you to see the latest changes made by others.

11\. Rebase: Rebase is a command used to integrate changes from one branch onto another by moving or combining commits. It allows for a linear commit history and helps in keeping the repository clean and organized.

Example: To perform an interactive rebase, where you can modify, reorder, or squash commits, you would use the following command:

```
git rebase -i 
```

12\. Stash: The git stash command allows you to save your local changes temporarily and revert to a clean working directory without committing the changes. It is useful when you need to switch branches or pull changes before committing your work.

Example: To stash your changes, you would use the following command:

```
git stash save "Descriptive stash message"
```

13\. Tag: A tag is a named reference to a specific commit. It is often used to mark important points in a repository’s history, such as releases or major milestones.

Example: To create an annotated tag named “v1.0” for a specific commit, you would use the following command:

```
git tag -a v1.0 -m "Version 1.0"
```

14\. Fork: Forking is a process where you create a copy of a repository under your own GitHub account. It allows you to freely experiment with changes without affecting the original repository.

15\. Pull Request: A pull request is a mechanism for proposing changes to a repository. It enables collaboration and discussion around code changes before merging them into the main branch.

Example: After making changes in your forked repository, you can open a pull request on the original repository to request the owner to review and merge your changes.

16. .gitignore: The .gitignore file is used to specify files or directories that should be ignored by Git. It allows you to exclude certain files, such as build artifacts or temporary files, from being tracked by Git.

Example: To ignore files with a specific extension, you can add the following line to your .gitignore file:

```
*.log
```

Example: To add a remote named “origin” pointing to a remote repository URL, you would use the following command:

```
git remote add origin 
```

In conclusion, Git stands as a powerful and widely adopted distributed version control system that revolutionizes the way developers manage source code. Its key features, including repositories, cloning, commits, branches, merges, and remotes, enable efficient collaboration, tracking of changes, and seamless code integration.

Through Git, developers can clone repositories, make changes, commit them with meaningful messages, and push those changes to remote repositories for others to access and synchronize their work. Branching allows for parallel development of new features and bug fixes, ensuring a clean separation from the main codebase until ready for integration.

Git’s ability to merge changes from different branches, as well as pull and fetch the latest updates from remote repositories, facilitates seamless collaboration among team members. The rebase command assists in maintaining a linear commit history, while the stash command enables temporarily saving changes without committing them.

Furthermore, Git provides essential concepts like remote tracking branches, tags for marking important milestones, and the .gitignore file for excluding certain files from version control.

By understanding and harnessing Git’s capabilities, developers can streamline their workflows, ensure version control, enhance collaboration, and maintain a clear history of changes within their projects. Continual exploration and adoption of Git’s advanced features and best practices can lead to efficient and effective software development processes.

In essence, Git empowers developers to work with confidence, navigate complex codebases, and collaborate seamlessly, ultimately contributing to improved productivity and the successful delivery of high-quality software projects.
