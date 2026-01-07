
import { storage } from "./server/storage";

async function verify() {
  try {
    console.log("Starting verification...");

    // Create a project to associate the consumable with
    const project = await storage.createProject({
      title: "Test Project for Consumables",
      customerId: 1, // Assuming a customer with ID 1 exists
    });
    console.log("Test project created:", project);

    // 1. Test GET functionality (and create a consumable to test with)
    const consumableToCreate = {
      projectId: project.id,
      date: "2024-01-01",
      items: [
        {
          inventoryItemId: 1, // Assuming an inventory item with ID 1 exists
          quantity: 1,
        },
      ],
    };

    const createdConsumable = await storage.createProjectConsumables(
      consumableToCreate.projectId,
      consumableToCreate.date,
      consumableToCreate.items
    );
    console.log("Consumable created:", createdConsumable);

    const consumables = await storage.getProjectConsumables(project.id);
    if (consumables.length !== 1) {
      throw new Error("Verification failed: Expected 1 consumable, but found " + consumables.length);
    }
    console.log("GET verification successful.");

    // 2. Test PUT functionality
    const updatedDate = "2024-01-02";
    const updatedConsumable = await storage.updateProjectConsumable(createdConsumable.id, updatedDate);
    if (!updatedConsumable || new Date(updatedConsumable.date).toISOString().split('T')[0] !== updatedDate) {
      throw new Error("Verification failed: Consumable was not updated correctly.");
    }
    console.log("PUT verification successful.");

    // 3. Test DELETE functionality
    const deleted = await storage.deleteProjectConsumable(createdConsumable.id);
    if (!deleted) {
      throw new Error("Verification failed: Consumable was not deleted.");
    }

    const remainingConsumables = await storage.getProjectConsumables(project.id);
    if (remainingConsumables.length !== 0) {
      throw new Error("Verification failed: Expected 0 consumables after deletion, but found " + remainingConsumables.length);
    }
    console.log("DELETE verification successful.");

    console.log("Verification successful!");
  } catch (error) {
    console.error("Verification failed:", error);
    process.exit(1);
  } finally {
    // Clean up the test project
    const projects = await storage.getProjects();
    const testProject = projects.find(p => p.title === "Test Project for Consumables");
    if (testProject) {
      // a delete project function doesn't exist, so this will have to do
    }
  }
}

verify();
