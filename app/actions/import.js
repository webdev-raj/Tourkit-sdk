'use server'

import { redirect } from 'next/navigation'

import { createProject } from '@/app/actions/projects'
import { createStep, getTourByProjectId } from '@/app/actions/tours'

export async function importProjectWithSteps(prevState, formData) {
  const name = String(formData.get('name') || '').trim()
  const domain = String(formData.get('domain') || '').trim()
  const stepsRaw = String(formData.get('steps') || '')

  if (!name) return { error: 'Project name is required.' }
  if (!domain) return { error: 'Domain is required.' }

  let steps = []
  try {
    steps = JSON.parse(stepsRaw)
  } catch {
    return { error: 'Invalid steps data. Generate your tour again.' }
  }

  if (!Array.isArray(steps) || steps.length === 0) {
    return { error: 'No steps to import.' }
  }

  const projectForm = new FormData()
  projectForm.set('name', name)
  projectForm.set('domain', domain)

  const projectResult = await createProject(null, projectForm)
  if (projectResult.error) return { error: projectResult.error }
  if (!projectResult.projectId) {
    return { error: 'Project was created but could not be loaded. Try again from the dashboard.' }
  }

  const tourRes = await getTourByProjectId(projectResult.projectId)
  if (tourRes.error || !tourRes.data?.id) {
    return { error: tourRes.error || 'Could not create a tour for this project.' }
  }

  for (const step of steps) {
    const result = await createStep(tourRes.data.id, {
      title: step.title,
      message: step.message,
      selector: step.selector,
      position: step.position,
      url_pattern: step.url_pattern,
    })
    if (result.error) return { error: result.error }
  }

  redirect(`/dashboard/projects/${projectResult.projectId}`)
}
