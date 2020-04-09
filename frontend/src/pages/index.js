import React from "react"

import Layout from "../components/layout"
import Code from "../components/code"
import SEO from "../components/seo"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <h1>A complete recipe book api for Trader Joe's</h1>
    <p>
      This is a super simple API for getting recipes from Trader Joe's. This API
      is built on top of Firebase using serverless cloud functions to handle the
      REST api.
    </p>

    <h2>Documentation</h2>

    <p>No keys needed. Just request any API for access.</p>

    <h3>Recipes</h3>
    <h4>All Recipes</h4>
    <Code text="https://traderjoeapi.jackgisel.com/api/recipes" />
    <br></br>
    <h4>Recipe by ID</h4>
    <Code text="https://traderjoeapi.jackgisel.com/api/recipes/1" />
    <br></br>
    <h4>Recipes by Tag</h4>
    <Code text="https://traderjoeapi.jackgisel.com/api/recipes?tagId=1" />
    <p>Change "=1" to your desired tag id.</p>
    <br></br>

    <h3>Tags</h3>
    <h4>Get all tags</h4>
    <Code text="https://traderjoeapi.jackgisel.com/api/tags/" />
    <br></br>
    <h4>Tag by ID</h4>
    <Code text="https://traderjoeapi.jackgisel.com/api/tags/1" />
    <br></br>
  </Layout>
)

export default IndexPage
