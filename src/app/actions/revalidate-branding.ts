'use server';

import { revalidatePath } from 'next/cache';

export async function revalidateBranding() {
  revalidatePath('/', 'layout');
}
