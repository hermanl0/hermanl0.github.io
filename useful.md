**Step-by-Step Guide to Generating New Content for Your Hugo Blog and Posting it to GitHub**

1. **Create a new draft**
```bash
hugo new content/english/post/new-post.md
```
2. **Write your content**
```
check syntax
```
3. **Check changes locally in hugo**
```
hugo server
```
4. **Update GitHub with the new file**
	* First, add the new file to the staging area using `git add content/english/post/new-post.md`
	* Then, commit the change with a meaningful title and message using `git commit -m "New blog post: <title>"` (replace `<title>` with a brief summary of your post)
	* Finally, push the committed changes to your remote repository on GitHub using `git push origin master`
5. **Verify your changes are live**
	* Visit your blog's website to verify that your new content is now live and visible
