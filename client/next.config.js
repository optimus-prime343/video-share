/* eslint-disable */
const withTM = require('next-transpile-modules')(['@vime/core', '@vime/react'])
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
}

module.exports = withTM(nextConfig)
