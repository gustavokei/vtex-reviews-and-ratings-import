# vtex-reviews-and-ratings-import

## What is this
This is a Node.js script created as a workaround to import reviews and ratings for VTEX.

There is [a very old issue](https://github.com/vtex-apps/reviews-and-ratings/issues/21) still open in their repository regarding this and [another one](https://community.vtex.com/t/como-importar-reviews-no-app-reviews-and-ratings/23761) posted in their own community. It seems it is not in their backlog yet. However, they welcome anyone to create a pull request to solve this issue.

Due to time constraints, this was the fastest and most acceptable solution for my client. I believe more people could benefit from it, so I am publishing it here.

Basically, it makes a `POST` request to create multiple reviews based on the contents of a .csv file (refer to [this documentation](https://developers.vtex.com/docs/api-reference/reviews-and-ratings-api#post-/reviews-and-ratings/api/reviews)).

The only limitation is that it will not import the `TIME` and `SKU` columns.

## How to use it
### 1. Exporting your existing reviews and ratings
- Go to https://youraccount.myvtex.com/admin/reviews-ratings/download/, select the time range, and click on the `Download` button.
![download existing reviews and ratings image](https://i.imgur.com/GK5Q1p8.png)
- You will get a "reviews.xls" file with this format:

| Product ID | Title  | Review           | Rating | Approved | Reviewer | Time              | SKU |
|------------|--------|------------------|--------|----------|----------|-------------------|-----|
| 1          | Title1 | This is cool!    | 5      | TRUE     | Elaine   | 06/10/2024 16:49:40 |     |
| 2          | Title2 | I hate this!!    | 1      | FALSE    | Arthur   | 06/10/2024 16:49:40 |     |

- Delete the `TIME` and `SKU` columns as already mentioned.
- Finally, you need to convert the .xls to .csv. I have used https://docs.google.com/spreadsheets to do so.

### 2. Running the script
- Simply clone or download this repository and run:
```
npm install
```
- Now create a `.env` file or rename the `.env.example` file and set your variables.
- Then, run:
```
npm run import path-to-your-csv
```
- If everything was done correctly, you should see:
```
CSV file successfully processed
X rows were uploaded
```

### 3. Some important information
- Since this is highly untested, it is recommended that you proceed with caution.
- For example, make a test request with 2 to 4 rows (all unapproved).
- I am not sure how many rows you can upload at once as there is no information regarding this, but I have tested uploading a little more than 100 rows.
