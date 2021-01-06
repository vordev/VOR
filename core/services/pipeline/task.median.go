package pipeline

import (
	"context"
	"sort"

	"github.com/pkg/errors"
	"github.com/shopspring/decimal"
	"go.uber.org/multierr"

	"github.com/vordev/VOR/core/utils"
)

type MedianTask struct {
	BaseTask `mapstructure:",squash"`
}

var _ Task = (*MedianTask)(nil)

func (t *MedianTask) Type() TaskType {
	return TaskTypeMedian
}

func (t *MedianTask) Run(_ context.Context, taskRun TaskRun, inputs []Result) (result Result) {
	if len(inputs) == 0 {
		return Result{Error: errors.Wrapf(ErrWrongInputCardinality, "MedianTask requires at least 1 input")}
	}

	answers := []decimal.Decimal{}
	fetchErrors := []error{}

	for _, input := range inputs {
		if input.Error != nil {
			fetchErrors = append(fetchErrors, input.Error)
			continue
		}

		answer, err := utils.ToDecimal(input.Value)
		if err != nil {
			fetchErrors = append(fetchErrors, err)
			continue
		}

		answers = append(answers, answer)
	}

	errorRate := float64(len(fetchErrors)) / float64(len(answers)+len(fetchErrors))
	if errorRate >= 0.5 {
		return Result{Error: errors.Wrap(ErrBadInput, "majority of fetchers in median failed: "+multierr.Combine(fetchErrors...).Error())}
	}

	sort.Slice(answers, func(i, j int) bool {
		return answers[i].LessThan(answers[j])
	})
	k := len(answers) / 2
	if len(answers)%2 == 1 {
		return Result{Value: answers[k]}
	}
	median := answers[k].Add(answers[k-1]).Div(decimal.NewFromInt(2))
	return Result{Value: median}
}
