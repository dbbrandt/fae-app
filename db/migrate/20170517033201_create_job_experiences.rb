class CreateJobExperiences < ActiveRecord::Migration[5.0]
  def change
    create_table :job_experiences do |t|
      t.string :title
      t.integer :order
      t.text :body
      t.text :job_link
      t.date :date

      t.timestamps
    end
  end
end
