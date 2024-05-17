export type GitHubPathElement = {
    name: string,
    path: string,
    sha: string,
    size: number,
    url: string,
    html_url: string,
    git_url: string,
    download_url: string | null,
    type: string,
    _links: any,
    children: GitHubPathElement[]
}